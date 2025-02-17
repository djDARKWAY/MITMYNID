-- DROP FUNCTION template.fn_delete_user(text);
CREATE OR REPLACE FUNCTION template.fn_delete_user(delete_code text)
RETURNS BOOLEAN AS $$
DECLARE
	user_id uuid;
	user_email text;
BEGIN
  SELECT INTO user_email email_cliente FROM template.pedidos_remocao WHERE code = delete_code;
  SELECT INTO user_id id FROM template.app_users WHERE email = user_email AND active = true AND blocked = false AND deleted = false;

 	IF(user_id IS NULL) THEN
		RETURN FALSE;
	END IF;

  UPDATE template.app_users
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

  UPDATE template.pedidos_remocao SET data_confirm = NOW() WHERE code = delete_code;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
