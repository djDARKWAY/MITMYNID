import { TranslationMessages } from "react-admin";

const englishMessages: TranslationMessages = {
  ra: {
    action: {
      add_filter: 'Filter',
      add: 'Add',
      back: 'Go Back',
      bulk_actions: '1 item selected |||| %{smart_count} items selected',
      cancel: 'Cancel',
      clear_input_value: 'Clear value',
      clear_array_input: 'Clear values',
      clone: 'Clone',
      confirm: 'Confirm',
      create: 'Create',
      create_item: 'Create %{item}',
      delete: 'Delete',
      edit: 'Edit',
      export: 'Export',
      list: 'List',
      refresh: 'Refresh',
      remove_filter: 'Remove this filter',
      remove: 'Remove',
      save: 'Save',
      search: 'Search',
      select_all: 'Select all',
      select_row: 'Select this row',
      show: 'Show',
      sort: 'Sort',
      undo: 'Undo',
      unselect: 'Unselect',
      expand: 'Expand',
      close: 'Close',
      open_menu: 'Open menu',
      close_menu: 'Close menu',
      update: 'Update',
      move_up: 'Move up',
      move_down: 'Move down',
      open: 'Open',
      toggle_theme: 'Toggle Theme',
      associate_entity: 'Associate Entity',
      copy: 'Copy',
      remove_all_filters: 'Remove all filters',
      invert: 'Invert',
      select_columns: 'Select columns',
      update_application: ""
    },
    page: {
      create: '',
      dashboard: 'Dashboard',
      edit: '',
      error: 'Something went wrong',
      list: '%{name}',
      loading: 'Loading',
      not_found: 'Not Found',
      unauthorized: 'Not Unauthorized',
      show: '',
      empty: 'No items yet.',
      empty_create: 'Click here to create a new record',
      invite: 'Do you want to add one?',
      configuration: 'Configuration',
      profile: 'Profile',
      access_denied: 'Access Denied',
      authentication_error: 'Authentication Error'

    },
    navigation: {
      no_results: 'No results found',
      no_more_results:
        'The page number %{page} is out of boundaries. Try the previous page.',
      page_out_of_boundaries: 'Page number %{page} out of boundaries',
      page_out_from_end: 'Cannot go after last page',
      page_out_from_begin: 'Cannot go before page 1',
      page_range_info: '%{offsetBegin}-%{offsetEnd} of %{total}',
      partial_page_range_info:
        '%{offsetBegin}-%{offsetEnd} of more than %{offsetEnd}',
      current_page: 'Page %{page}',
      page: 'Go to page %{page}',
      first: 'Go to first page',
      last: 'Go to last page',
      next: 'Go to next page',
      previous: 'Go to previous page',
      page_rows_per_page: 'Rows per page:',
      skip_nav: 'Skip to content',
      no_filtered_results: 'No Filter Results',
      clear_filters: 'Clear Filters'
    },
    auth: {
      auth_check_error: 'Please login to continue',
      user_menu: 'Profile',
      username: 'Username',
      password: 'Password',
      sign_in: 'Sign in',
      sign_in_error: 'Authentication failed, please retry',
      logout: 'Logout',
      email: 'Email',
      remember_me: 'Remember Me',
      forgot: 'Recover password',
      insert_code: 'Insert Code',
      alter_password: 'New Password'
    },
    sort: {
      sort_by: 'Sort by %{field} %{order}',
      ASC: 'ascending',
      DESC: 'descending',
    },
    boolean: {
      true: 'Yes',
      false: 'No',
      null: ' ',
    },
    validation: {
      required: 'Required',
      minLength: 'Must be %{min} characters at least',
      maxLength: 'Must be %{max} characters or less',
      minValue: 'Must be at least %{min}',
      maxValue: 'Must be %{max} or less',
      number: 'Must be a number',
      email: 'Must be a valid email',
      oneOf: 'Must be one of: %{options}',
      regex: 'Must match a specific format (regexp): %{pattern}',
      invalid: 'Invalid value'
    },
    notification: {
      updated: 'Item updated',
      updated_error: "Error updating item ",
      created: 'Element created',
      deleted: '%{smart_count} element/s deleted',
      deleted_error: "Error deleting item",
      bad_item: 'Incorrect element',
      item_doesnt_exist: 'Element does not exist',
      http_error: 'Server communication error',
      data_provider_error: 'dataProvider error. Check the console for details.',
      i18n_error: 'Cannot load the translations for the specified language',
      canceled: 'Action cancelled',
      logged_out: 'Your session has ended, please reconnect.',
      not_authorized: "You're not authorized to access this resource.",
      copy: 'Item copied',
      copy_error: 'Error copying item',
      application_update_available: ""
    },

    message: {
      about: 'About',
      are_you_sure: 'Are you sure?',
      auth_error: 'Authentication error',
      bulk_delete_content: 'Are you sure you want to delete this %{name}? |||| Are you sure you want to delete these %{smart_count} items?',
      bulk_delete_title: 'Delete %{name} |||| Delete %{smart_count} %{name}',
      bulk_update_content: 'Are you sure you want to update this %{name}? |||| Are you sure you want to update these %{smart_count} items?',
      bulk_update_title: 'Update %{name} |||| Update %{smart_count} %{name}',
      clear_array_input: 'Do you wish to eliminate all fields?',
      delete_content: 'Are you sure you want to delete this item?',
      delete_title: 'Delete %{name} #%{id}',
      details: 'Details',
      error: "A client error occurred and your request couldn't be completed.",
      invalid_form: 'The form is not valid. Please check for errors',
      loading: 'The page is loading, just a moment please',
      no: 'No',
      not_found: 'Either you typed a wrong URL, or you followed a bad link.',
      unauthorized: "Not authorized to this page",
      yes: 'Yes',
      unsaved_changes: "Some of your changes weren't saved. Are you sure you want to ignore them?",
      ondroprejected: 'Invalid image. Maximum size of 5MB',
      access_denied: 'Access Denied',
      authentication_error: 'Authentication Error'
    },
    input: {
      file: {
        upload_several:
          'Drop some files to upload, or click to select one.',
        upload_single: 'Drop a file to upload, or click to select it.',
      },
      image: {
        upload_several:
          'Drop some pictures to upload, or click to select one.',
        upload_single:
          'Drop a picture to upload, or click to select it.',
      },
      references: {
        all_missing: 'Unable to find references data.',
        many_missing:
          'At least one of the associated references no longer appears to be available.',
        single_missing:
          'Associated reference no longer appears to be available.',
      },
      password: {
        toggle_visible: 'Hide password',
        toggle_hidden: 'Show password',
      },
    },
    saved_queries: {
      label: 'Saved queries',
      query_name: 'Query name',
      new_label: 'Save current query...',
      new_dialog_title: 'Save current query as',
      remove_label: 'Remove saved query',
      remove_label_with_name: 'Remove query "%{name}"',
      remove_dialog_title: 'Remove saved query?',
      remove_message:
        'Are you sure you want to remove that item from your list of saved queries?',
      help: 'Filter the list and save this query for later',
    }
  },
  pos: {
    labels: {
      search: 'Search by name',
      searchTitle: 'Search by title'
    },
    menu: {
      config: 'Configuration',
      seguranca: 'Security',
      accesspoint: 'Access Point',
      certificates: 'Certificates',
      monitorizacao: 'Monitoring',
      language: 'Language'
    },
    language: 'Language'
  },
  resources: {
    'app-users-sessions': {
      name: 'Sessions',
      // edit_title: 'Editar Sessão',
      // create_title: 'Criar Sessão',
      fields: {
        app_id: 'Application',
        validity: 'Validity'
      }
    },
    accesspoints: {
      list: "APs list",
      manage: "Access Management"
    },
    certificates: {
      list: "Certificates list",
      validations: "Validations"
    },
    monitoring: {
      status: "Network status",
      logs: "Logs"
    },
    utilizadores: {
      name: "Users",
      edit_title: 'Edit User',
      create_title: "Create User",
      tabs: {
        prefs_util: 'Preferences'
      },
      fields: {
        nome: 'Name',
        morada: 'Address',
        nif: 'Tax Identification nº',
        nic: 'Civil Identification nº',
        cc: 'Citizen Card nº',
        telefone: 'Telephone',
        telemovel: 'Cellphone',
        password: 'Password',
        foto: 'Image',
        ativo: 'Active',
        ult_acesso: 'Last Access',
        // entidade: 'Entity',
        roles: 'Roles',
        username: 'Username',
        confirm_password: 'Confirm password',
        cod_postal: 'Postal Code',
        validation_date: 'Validation Date',
        tema_fav: 'Theme',
        lang_fav: 'Idioma Language',
        use_email: 'Use email?'
      },
      field_validation: {
        password: 'Password must contain 6 characters, at least one of them being a number',
        email: "Must not contain the following values: !#$%&'*+/?^`{|}()~",
        name: 'Only letters and the following characters: _-.',
        telefone: 'Must be a valid telephone number: 00000000',
        telemovel: 'Must be a valid cellphone number: 00000000',
        nif: 'Must be a valid tax identification nº: 00000000',
        nic: 'Must be a valid civil identification nº: 00000000',
        cc: 'Must be a valid citizen card nª: 0000000000 (10)',
        username: 'It can only contain letters and the following characters: _',
        cod_postal: 'Only numbers and the following characters: -.@[]-',
      }
    },
    role: {
      name: "Roles",
      edit_title: 'Edit Role',
      create_title: "Create Role",
      fields: {
        nome: 'Description',
      }
    }
  },
};

export default englishMessages;
