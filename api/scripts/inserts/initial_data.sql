-- SECURITY DATA

-- ADD roles
INSERT INTO auth.role(id, description)VALUES
('659663ef-8316-48b4-84fe-b894bbfff861', 'user'),
('9eecc136-c33c-46b0-bb5e-767f806caf4c', 'ADMIN');

--Add Admin user
 --password default: 12345678
INSERT INTO auth.app_users(id, person_name, username, email, password, active, blocked, validation_date) VALUES ('68d5b92e-8627-457f-8ef4-60b062fd62dd', 'Administrator', 'admin', 'mail@mitmynid.com',  '$2a$10$iFbOjYZRQicVIRydUm7za.IvM1B8rMjQ6VSDuZCceU2kzro1jnY4.', true, false, '2022-08-10');

INSERT INTO auth.prefs_util(id_utilizador, tema_fav, lang_fav)VALUES ('68d5b92e-8627-457f-8ef4-60b062fd62dd', null, null);

INSERT INTO auth.app_users_role(id, app_users_id, role_id) VALUES ('8410b510-683b-4e11-92f2-2cb6534172d7', '68d5b92e-8627-457f-8ef4-60b062fd62dd', '9eecc136-c33c-46b0-bb5e-767f806caf4c');
