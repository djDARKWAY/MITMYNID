
-- DROP FUNCTION users.generate_authenticator(out text, out timestamp);

CREATE OR REPLACE FUNCTION users.generate_authenticator(OUT code text, OUT expires timestamp without time zone)
 RETURNS record
 LANGUAGE plpgsql
AS $function$
    BEGIN
        SELECT array_to_string(
            ARRAY(
                SELECT chr((48 + round(random() * 9)) :: integer) FROM generate_series(1,6)
            ),
        '')
        INTO code;

        SELECT (NOW() :: timestamp + interval '5 minutes') INTO expires;
    END;$function$
;
