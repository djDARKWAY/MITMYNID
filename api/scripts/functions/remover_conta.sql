-- DROP FUNCTION auth.fn_delete_user(text);
CREATE OR REPLACE FUNCTION auth.fn_delete_user(delete_code text)
RETURNS BOOLEAN AS $$
DECLARE
	user_id uuid;
	user_email text;
BEGIN
  SELECT INTO user_email email_cliente FROM auth.pedidos_remocao WHERE code = delete_code;
  SELECT INTO user_id id FROM auth.app_users WHERE email = user_email AND active = true AND blocked = false AND deleted = false;

 	IF(user_id IS NULL) THEN
		RETURN FALSE;
	END IF;

  UPDATE auth.app_users
    SET
      person_name = md5(random()::text),
      username = md5(random()::text),
      password = md5(random()::text),
      address = NULL,
      nif = NULL,
      nic = NULL,
      cc_num = NULL,
      email = md5(random()::text),
      phone = NULL,
      mobile = NULL,
      post_code = NULL,
      app_code = NULL,
      photo = NULL,
      active = false,
      deleted = true
    WHERE
      id = user_id;

  UPDATE auth.pedidos_remocao SET data_confirm = NOW() WHERE code = delete_code;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
