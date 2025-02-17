import config from '../../utils/config.json';

const generateRegisterActiveEmail = (url: string, farewell: string, noreply: string, address: string, phone: string, person_name: string) => `
<!doctype html>
<html>

<head>
  <meta http-equiv="content-type" content="text/html; ">
</head>

<body text="#000000" bgcolor="#FFFFFF">
  <div class="moz-forward-container">
    <br>
    <br>
    <br>
    <div class="moz-forward-container">
      <meta http-equiv="Content-Type" content="text/html;
            charset=UTF-8">
      <style type="text/css">
        a,
        a:hover,
        a:active,
        a:visited {
          color: #000000 !important;
        }

        .code-digit {
          background: #05a3ff;
          font-size: 2rem;
          opacity: 80%;
          border-radius: 5px;
          font-family: Arial, sans-serif, 'Motiva Sans';
          color: white;
          padding: 5px;
        }

        .imglogo {
          width: 200px;
          max-width: 200px;
        }
      </style>
      <table style="width:100%;padding-bottom: 10px;">
        <tbody>
          <tr>
            <td align="center">
              <img src="cid:${config.email_server.logo.cid}" width="720px" class="imglogo" />
            </td>
          </tr>
        </tbody>
      </table>
      <table class="envio-encomenda" style="width: 100%; max-width:
            790px; margin: 0 auto;padding: 0;" cellspacing="0" cellpadding="0" align="center">
        <tbody>
          <tr>
            <td style="margin: 0;padding: 0;" width="4%"> <br>
            </td>
            <td style="margin: 0;padding: 0;" width="92%" valign="top" align="left">
              <table style="width:100%;font-size:16px; line-height:
                    20px; color:#262626; text-align: left; font-family:
                    'bryantProRegular', 'Helvetica Neue', 'Helvetica',
                    'Arial', sans-serif;">
                <tbody>
                  <tr>
                    <td style="padding-top: 30px;">
                      Caro(a) / Estimado / Dear / Cher <br>
                      ${person_name}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top: 30px;">
                      A sua conta foi ativada com sucesso. <a href="${url}/#/login">Entrar</a> <br>
                      Su cuenta ha sido activada. <a href="${url}/#/login">Entrar</a> <br>
                      Your account has been successfully activated. <a href="${url}/#/login">Enter</a> <br>
                      Votre compte a été activé avec succès. <a href="${url}/#/login">Entrer</a>
                    </td>
                  </tr>
                </tbody>
              </table>

              <br>
              <br>

              <table style="border-bottom: #f2f2f2 3px solid; border-spacing:
                    0;border-collapse: separate;vertical-align:
                    top;text-align: center;width: 100%; position:
                    relative;padding: 0;" cellspacing="0" cellpadding="0">
                <tbody>
                  <tr>
                    <td width="4%"></td>
                    <td style="margin: 0;padding: 0;" width="92%" valign="top" align="center"></td>
                    <td width="4%"></td>
                  </tr>
                </tbody>
              </table>


              <table style="width:100%;font-size:12px; line-height:
                    20px; color:#262626; text-align: left; font-family:
                    'bryantProRegular', 'Helvetica Neue', 'Helvetica',
                    'Arial', sans-serif;">
                <tbody>
                  <tr>
                    <td style="padding-top: 25px;">${noreply}</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 60px;"><br>
                      ${farewell}<br>
                      MITMYNID<br>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td style="margin: 0;padding: 0;" width="4%"> <br>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
</body>

</html>
`

export default generateRegisterActiveEmail
