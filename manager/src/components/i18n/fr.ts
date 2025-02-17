import { TranslationMessages } from "react-admin";

const frenchMessages: TranslationMessages = {
  ra: {
    action: {
      add_filter: 'Filtre',
      add: 'Ajouter',
      back: 'Retour',
      bulk_actions: '%{smart_count} sélectionné |||| %{smart_count} sélectionnés',
      cancel: 'Annuler',
      clear_input_value: 'Vider le champ',
      clear_array_input: 'Effacer les valeurs',
      clone: 'Dupliquer',
      confirm: 'Confirmer',
      create: 'Créer',
      create_item: 'Créer %{item}',
      delete: 'Supprimer',
      edit: 'Éditer',
      export: 'Exporter',
      list: 'Liste',
      refresh: 'Actualiser',
      remove_filter: 'Supprimer ce filtre',
      remove: 'Supprimer',
      save: 'Enregistrer',
      select_all: 'Tout sélectionner',
      select_row: 'Sélectionner cette ligne',
      search: 'Rechercher',
      show: 'Afficher',
      sort: 'Trier',
      undo: 'Annuler',
      unselect: 'Désélectionner',
      expand: 'Étendre',
      close: 'Fermer',
      open_menu: 'Ouvrir le menu',
      close_menu: 'Fermer le menu',
      update: 'Modifier',
      move_up: 'Déplacer vers le haut',
      move_down: 'Déplacer vers le bas',
      open: 'Ouvrir',
      toggle_theme: 'Thème clair/sombre',
      associate_entity: 'Associate Entity',
      copy: 'Copie',
      remove_all_filters: 'Supprimer ce filtre',
      invert: 'Inverser',
      select_columns: 'Sélectionner les colonnes',
      update_application: ""
    },
    page: {
      create: '',
      dashboard: 'Dashboard',
      edit: '',
      error: "Quelque chose s'est mal passé",
      list: '',
      loading: 'Chargement',
      unauthorized: 'Pas autorisé',
      not_found: 'Pas trouvé',
      show: '',
      empty: 'Pas encore de éléments',
      empty_create: 'Cliquez ici pour créer un nouvel enregistrement',
      invite: 'Veux-tu en ajouter un?',
      configuration: 'Configuration',
      profile: 'Profil',
      access_denied: 'Access Denied',
      authentication_error: 'Authentication Error'
    },
    sort: {
      sort_by: 'Trier par %{field} %{order}',
      ASC: 'croissant',
      DESC: 'décroissant',
    },
    navigation: {
      no_results: 'Aucun résultat',
      no_more_results: 'La page numéro %{page} est en dehors des limites. Essayez la page précédente.',
      page_out_of_boundaries: 'La page %{page} est en dehors des limites',
      page_out_from_end: 'Fin de la pagination',
      page_out_from_begin: 'La page doit être supérieure à 1',
      page_range_info: '%{offsetBegin}-%{offsetEnd} sur %{total}',
      partial_page_range_info:
        '%{offsetBegin}-%{offsetEnd} sur plus de %{offsetEnd}',
      page_rows_per_page: 'Lignes par page :',
      current_page: 'Page %{page}',
      page: 'Aller à la page %{page}',
      first: 'Aller à la première page',
      last: 'Aller à la dernière page',
      next: 'Aller à la prochaine page',
      previous: 'Aller à la page précédente',
      skip_nav: 'Aller au contenu',
      no_filtered_results: 'No Filter Results',
      clear_filters: 'Clear Filters'
    },
    notification: {
      updated: 'Élément mis à jour',
      updated_error: "Erreur lors de la mise à jour de l'élément",
      created: 'Elément créé',
      deleted: '%{smart_count} élément(s) supprimé(s)',
      deleted_error: "Erreur lors de la suppression de l'élément",
      bad_item: 'Élément incorrect',
      item_doesnt_exist: "L'élément n'existe pas",
      http_error: 'Erreur de communication du serveurr',
      data_provider_error: "erreur du fournisseur de données. Vérifiez la console pour plus de détails.",
      i18n_error: 'Impossible de charger les traductions pour la langue spécifiée',
      canceled: 'Action annulée',
      logged_out: 'Votre session est terminée, veuillez vous reconnecter.',
      not_authorized: "Vous n'êtes pas autorisé à accéder à cette ressource.",
      copy: 'Élément copié',
      copy_error: "Erreur lors de la copie de l'élément",
      application_update_available: ""
    },
    auth: {
      auth_check_error: 'Merci de vous connecter pour continuer',
      user_menu: 'Profil',
      username: 'Identifiant',
      password: 'Mot de passe',
      sign_in: 'Connexion',
      sign_in_error: "Échec de l'authentification, merci de réessayer",
      logout: 'Déconnexion',
      remember_me: 'Souviens-toi de moi',
      forgot: 'Récupérer le mot de passe',
      insert_code: 'Insérer un code',
      alter_password: 'Nouveau mot de passe'
    },
    validation: {
      required: 'Obligatoire',
      minLength: 'Doit contenir au moins %{min} caractères',
      maxLength: 'Doit contenir %{max} caractères ou moins',
      minValue: 'Doit être au moins %{min}',
      maxValue: 'Doit être %{max} ou moins',
      number: 'Must be a number',
      email: 'Doit être un nombre',
      oneOf: "Doit être l'un des suivants : %{options}",
      regex: "Doit correspondre à un format spécifique (regexp): %{pattern}",
      invalid: 'Valeur invalide'
    },
    boolean: {
      true: 'Oui',
      false: 'Non',
      null: ' ',
    },
    message: {
      about: 'Au sujet de',
      are_you_sure: 'Êtes-vous sûr?',
      auth_error: "Erreur d'authentification",
      bulk_delete_content: 'Êtes-vous sûr(e) de vouloir supprimer cet élément ? |||| Êtes-vous sûr(e) de vouloir supprimer ces %{smart_count} éléments ?',
      bulk_delete_title: 'Supprimer %{name} |||| Supprimer %{smart_count} %{name}',
      bulk_update_content: 'Êtes-vous sûr(e) de vouloir modifier cet élément ? |||| Êtes-vous sûr(e) de vouloir modifier ces %{smart_count} éléments ?',
      bulk_update_title: 'Modifier %{name} |||| Modifier %{smart_count} %{name}',
      clear_array_input: 'Souhaitez-vous supprimer tous les champs?',
      delete_content: 'Êtes-vous sûr(e) de vouloir supprimer cet élément ?',
      delete_title: 'Supprimer élément',
      details: 'Détails',
      error: "En raison d'une erreur côté navigateur, votre requête n'a pas pu aboutir.",
      invalid_form: "Le formulaire n'est pas valide.",
      loading: 'La page est en cours de chargement, merci de bien vouloir patienter.',
      unauthorized: "Vous n'avez pas d'autorisation pour cette ressource",
      no: 'Non',
      not_found: "L'URL saisie est incorrecte, ou vous avez suivi un mauvais lien.",
      yes: 'Oui',
      unsaved_changes: "Certains changements n'ont pas été enregistrés. Êtes-vous sûr(e) de vouloir quitter cette page ?",
      ondroprejected: 'Image invalide. Taille maximale de 5 MB',
      access_denied: 'Access Denied',
      authentication_error: 'Authentication Error'
    },
    input: {
      file: {
        upload_several:
          'Déposez les fichiers à uploader, ou cliquez pour en sélectionner.',
        upload_single:
          'Déposez le fichier à uploader, ou cliquez pour le sélectionner.',
      },
      image: {
        upload_several:
          'Déposez les images à uploader, ou cliquez pour en sélectionner.',
        upload_single:
          "Déposez l'image à uploader, ou cliquez pour la sélectionner.",
      },
      references: {
        all_missing: 'Impossible de trouver des données de références.',
        many_missing:
          'Au moins une des références associées semble ne plus être disponible.',
        single_missing:
          'La référence associée ne semble plus disponible.',
      },
      password: {
        toggle_visible: 'Cacher le mot de passe',
        toggle_hidden: 'Montrer le mot de passe',
      },
    },
    saved_queries: {
      label: 'Mes requêtes',
      query_name: 'Nom de la requête',
      new_label: 'Ajouter à mes requêtes...',
      new_dialog_title: 'Ajouter la requête en cours à mes requêtes',
      remove_label: 'Retirer de mes requêtes',
      remove_label_with_name: 'Retirer "%{name}" des mes requêtes',
      remove_dialog_title: 'Effacer de mes requêtes ?',
      remove_message:
        'Etes-vous sûr(e) de vouloir supprimer cette requête de votre liste de requêtes ?',
      help: 'Filtrez la liste et ajoutez cette requête à votre liste',
    },
  },
  pos: {
    labels: {
      search: 'Rechercher par nom',
      searchTitle: 'Rechercher par titre'
    },
    menu: {
      config: 'Configuration',
      seguranca: 'Sécurité',
      language: 'Langue'
    },
    language: 'Langue'
  },
  resources: {
    'app-users-sessions': {
      name: 'Séances',
      // edit_title : 'Modifier la session',
      // create_title: 'Criar Session',
      fields: {
        app_id: 'Application',
        validity: 'Validité'
      }
    },
    utilizadores: {
      name: "Utilisateurs",
      edit_title: "Modifier l'utilisateur",
      create_title: "Créer un utilisateur",
      tabs: {
        prefs_util: 'Préférences'
      },
      fields: {
        nome: 'Nom',
        morada: 'Adresse',
        nif: "Nº d'identification fiscale",
        nic: "Nº d'identification civil",
        cc: 'Carte de citoyen',
        telefone: 'Téléphone',
        telemovel: 'Téléphone portable',
        password: 'Mot de passe',
        foto: 'Image',
        ativo: 'Actif',
        ult_acesso: 'Dernier accès',
        // entidade: 'Entité',
        roles: 'Rôle',
        username: "Nom d'utilisateur",
        confirm_password: 'Confirmez le mot de passe',
        cod_postal: 'Code postal',
        validation_date: 'Date de Validation',
        tema_fav: 'Thème',
        lang_fav: 'Langue',
        use_email: 'Utiliser email?'
      },
      field_validation: {
        password: "Le mot de passe doit contenir 6 caractères, au moins l'un d'entre eux étant un nombre",
        email: "Ne doit pas contenir les valeurs suivantes: !#$%&'*+/?^`{|}()~",
        name: 'Uniquement des lettres et les caractères suivants : _-.',
        telefone: 'Doit être un numéro de téléphone valide: 00000000',
        telemovel: 'Doit être un numéro de téléphone portable valide: 00000000',
        nif: "Doit être un numéro d'identification fiscale valide: 00000000",
        nic: "Doit être un numéro d'identification civil valide: 00000000",
        cc: 'Doit être une carte de citoyen valide: 0000000000',
        username: 'Il ne peut contenir que des lettres et les caractères suivants : _',
        cod_postal: 'Seuls les chiffres et les caractères suivants: -.@[]-',
      }
    },
    role: {
      name: "Rôle",
      edit_title: 'Modifier le rôle',
      create_title: "Créer un rôle",
      fields: {
        nome: 'Description',
      }
    }
  },
};

export default frenchMessages;
