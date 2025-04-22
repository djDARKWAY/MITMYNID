import { jwtDecode } from "jwt-decode";
import { Users, jwtObject } from "./types";

export const authProvider = {
  login: async ({ username, password }: any) => {
    const loginRequest = new Request(
      import.meta.env.VITE_REST_API + "man/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ username: username, password: password }),
        headers: new Headers({
          "Content-Type": "application/json",
          accept: "application/json",
        }),
      }
    );

    try {
      const loginResponse = await fetch(loginRequest);

      if (loginResponse.status < 200 || loginResponse.status >= 300) {
        return Promise.reject(loginResponse.statusText);
      }

      const auth = await loginResponse.json();
      localStorage.setItem("token", auth.token);

      const decodedToken = jwtDecode<jwtObject | undefined>(auth.token);

      if (!decodedToken || (decodedToken && !Array.isArray(decodedToken.roles)))
        return Promise.reject();

      const roles = decodedToken.roles;

      if (!roles.includes("ADMIN") || roles.includes("ARMAZEM"))
        return Promise.reject();

      const userRequest = new Request(
        import.meta.env.VITE_REST_API + "/auth/me",
        {
          method: "GET",
          headers: new Headers({
            Accept: "application/json",
            Authorization: `Bearer ${auth.token}`,
          }),
        }
      );

      const userResponse = await fetch(userRequest);
      const userData = await userResponse.json();

      const userTheme = userData.theme || "light";
      const userLanguage = userData.language || "pt";

      return Promise.resolve({
        redirectTo: "/dashboard",
        theme: userTheme,
        language: userLanguage
      });
    } catch {
      localStorage.removeItem("token");
      return Promise.reject();
    }
  },

  checkError: (error: any) => {
    const status = error.status;
    const token = localStorage.getItem("token");
    const profile = localStorage.getItem("profile");

    if (status === 401 || status === 403) {
      if (
        error.body.error.message.includes("token is not valid") ||
        error.body.error.message.includes("jwt expired")
      ) {
        // if(socket) {
        //     socket.removeAllListeners();
        //     socket.disconnect();
        //     removeSocket();
        // }

        localStorage.removeItem("token");
        localStorage.removeItem("profile");

        return Promise.reject({ redirectTo: "/", logoutUser: true });
      }

      if (profile && token)
        return Promise.reject({
          redirectTo: "/unauthorized",
          logoutUser: false,
        });
    }
    // other error code (404, 500, etc): no need to log out
    return Promise.resolve();
  },
  checkAuth: async () => {
    const token = localStorage.getItem("token");
    const allowedPaths: string[] = [
      // '#/',
    ];

    const location = window.location.hash.split("?")[0];

    if (!token && allowedPaths.includes(location)) return Promise.resolve();
    if (!token) return Promise.reject({ redirectTo: "/login" });

    return Promise.resolve();
  },
  logout: async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const requestSession = new Request(
        import.meta.env.VITE_REST_API + `/auth/logout`,
        {
          method: "GET",
          headers: new Headers({
            accept: "application/json",
            Authorization: "Bearer " + token,
          }),
        }
      );

      try {
        const response = await fetch(requestSession);

        if (response.status < 200 || response.status >= 300) {
          console.log(response.statusText);
        }
      } catch {
        console.log("Network error");
      }
    }

    // if(socket) {
    //     socket.removeAllListeners();
    //     socket.disconnect();
    //     removeSocket();
    // }

    localStorage.removeItem("token");
    localStorage.removeItem("profile");

    return Promise.resolve();
  },

  getIdentity: async () => {
    const profilePreParse = localStorage.getItem("profile");
    const token = localStorage.getItem("token");
    const profile = profilePreParse ? JSON.parse(profilePreParse) : null;

    if ((!profile || !profile.fullName || !profile.id) && token) {
      const request = new Request(import.meta.env.VITE_REST_API + "/auth/me", {
        method: "GET",
        headers: new Headers({
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        }),
      });

      const response = await fetch(request);

      if (!response) {
        localStorage.removeItem("token");
        localStorage.removeItem("profile");
        Promise.reject({ redirectTo: "/login" });
      }

      const data: Users = await response.json();

      const newProfile = {
        id: data.id,
        fullName: data.person_name,
        avatar: data.photo ? `${import.meta.env.VITE_REST_API}${data.photo}` : '',
        theme: data.theme || 'light',
        language: data.language || 'pt'
      }

      localStorage.setItem("profile", JSON.stringify(newProfile));

      try {
        return Promise.resolve(newProfile);
      } catch (error) {
        return Promise.reject(error);
      }
    }

    return Promise.resolve(profile);
  },

  getPermissions: (params: any) => {
    const token = localStorage.getItem("token");

    // if (window.location.hash.split('?')[0] === '#/') return Promise.resolve([]);
    if (!token) return Promise.resolve(["guest"]);

    const decodedToken = jwtDecode<jwtObject | undefined>(token);

    if (!decodedToken || (decodedToken && !Array.isArray(decodedToken.roles)))
      return Promise.reject();

    const roles = decodedToken.roles;

    return roles ? Promise.resolve(roles) : Promise.reject();
  },
};
