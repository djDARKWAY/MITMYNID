import { error } from "console";
import { TranslationMessages } from "react-admin";

const englishMessages: TranslationMessages = {
  ra: {
    action: {
      add_filter: "Add Filter",
      add: "Add",
      back: "Back",
      bulk_actions: "1 item selected |||| %{smart_count} items selected",
      cancel: "Cancel",
      clear_input_value: "Clear input",
      clear_array_input: "Clear fields",
      clone: "Clone",
      confirm: "Confirm",
      success: "Success!",
      validate: "Validate",
      create: "Create",
      create_item: "Create %{item}",
      delete: "Delete",
      edit: "Edit",
      export: "Export",
      list: "List",
      refresh: "Refresh",
      remove_filter: "Remove filter",
      remove: "Remove",
      save: "Save",
      select_all: "Select all",
      select_row: "Select this row",
      search: "Search",
      show: "Show",
      sort: "Sort",
      undo: "Undo",
      unselect: "Unselect",
      expand: "Expand",
      close: "Close",
      open_menu: "Open Menu",
      close_menu: "Close Menu",
      update: "Update",
      move_up: "Move up",
      move_down: "Move down",
      open: "Open",
      toggle_theme: "Toggle light/dark theme",
      associate_entity: "Associate Entity",
      copy: "Copy",
      remove_all_filters: "Remove all filters",
      invert: "Invert",
      select_columns: "Select columns",
      update_application: "Update Application",
    },
    sort: {
      sort_by: "Sort by %{field} %{order}",
      ASC: "Ascending",
      DESC: "Descending",
    },
    boolean: {
      true: "Yes",
      false: "No",
      null: " ",
    },
    page: {
      create: "Create %{name}",
      dashboard: "Dashboard",
      edit: "%{name}",
      error: "An error occurred",
      list: "%{name}",
      loading: "Loading",
      not_found: "Not Found",
      unauthorized: "Unauthorized",
      show: "%{name} #%{id}",
      empty: "No records",
      empty_create: "Click here to create a new record",
      invite: "Would you like to add one?",
      configuration: "Configuration",
      profile: "Profile",
      general: "General",
      access_denied: "Access Denied",
      authentication_error: "Authentication Error",
    },
    input: {
      file: {
        upload_several: "Drag files here to upload or click to select.",
        upload_single: "Drag file here to upload or click to select.",
      },
      image: {
        upload_several: "Drag images here to upload or click to select.",
        upload_single: "Drag image here to upload or click to select.",
      },
      references: {
        all_missing: "Unable to find reference data.",
        many_missing: "At least one of the references is no longer available.",
        single_missing: "The associated reference is no longer available.",
      },
      password: {
        toggle_visible: "Hide password",
        toggle_hidden: "Show password",
      },
    },
    message: {
      about: "About",
      are_you_sure: "Are you sure?",
      auth_error: "Authentication error",
      bulk_delete_content:
        "Are you sure you want to delete %{name}? |||| Are you sure you want to delete these %{smart_count} items?",
      bulk_delete_title: "Delete %{name} |||| Delete %{smart_count} %{name}",
      bulk_update_content:
        "Are you sure you want to update this item? |||| Are you sure you want to update these %{smart_count} items?",
      bulk_update_title: "Update %{name} |||| Update %{smart_count} %{name}",
      clear_array_input: "Do you want to clear all items?",
      delete_content: "Are you sure you want to delete this item?",
      delete_title: "Delete item",
      details: "Details",
      error: "A client error occurred. Your request could not be completed.",
      invalid_form: "The form contains errors.",
      loading: "Loading. Please wait.",
      unauthorized: "You are not authorized to access this resource",
      no: "No",
      not_found: "Page not found.",
      yes: "Yes",
      unsaved_changes:
        "Some changes were not saved. Are you sure you want to leave this page?",
      ondroprejected: "Invalid image. Maximum size is 5 MB",
      access_denied: "Access Denied",
      authentication_error: "Authentication Error",
    },
    navigation: {
      no_results: "No results found.",
      no_more_results:
        "Page %{page} is out of boundaries. Try the previous page.",
      page_out_of_boundaries: "Page %{page} out of boundaries",
      page_out_from_end: "Cannot go after last page",
      page_out_from_begin: "Cannot go before first page",
      page_range_info: "%{offsetBegin}-%{offsetEnd} of %{total}",
      partial_page_range_info:
        "%{offsetBegin}-%{offsetEnd} out of more than %{offsetEnd}",
      page_rows_per_page: "Rows per page:",
      current_page: "Page %{page}",
      page: "Go to page %{page}",
      first: "Go to first page",
      last: "Go to last page",
      next: "Next",
      previous: "Previous",
      skip_nav: "Skip to content",
      no_filtered_results: "No Filter Results",
      clear_filters: "Clear Filters",
    },
    auth: {
      auth_check_error: "Please login to continue",
      user_menu: "Profile",
      username: "Username",
      password: "Password",
      sign_in: "Sign in",
      sign_in_error: "Authentication error. Please try again.",
      sign_up: "Sign up",
      logout: "Logout",
      remember_me: "Remember me",
      forgot: "Forgot password",
      insert_code: "Insert Code",
      alter_password: "New Password",
    },
    notification: {
      updated: "Item updated",
      updated_error: "Error updating item",
      created: "Item created",
      deleted: "Item deleted |||| %{smart_count} items deleted",
      deleted_error: "Error deleting item",
      bad_item: "Incorrect item",
      item_doesnt_exist: "Item does not exist",
      http_error: "Server communication error",
      data_provider_error: "Data provider error",
      i18n_error: "Unable to load translations for the specified language",
      canceled: "Action canceled",
      logged_out: "Your session has ended. Please reconnect",
      not_authorized: "You are not authorized to access this resource.",
      copy: "Item copied",
      copy_error: "Error copying item",
      application_update_available: "Application update available",
    },
    validation: {
      required: "Required",
      minLength: "Must be at least %{min} characters",
      maxLength: "Must be at most %{max} characters",
      minValue: "Must be %{min} or more",
      maxValue: "Must be %{max} or less",
      number: "Must be a number",
      email: "Must be a valid email",
      oneOf: "Must be one of: %{options}",
      regex: "Must match the specific format (regexp): %{pattern}",
      invalid: "Invalid value",
      maxFiles: "Must have at most 3 files",
    },
    saved_queries: {
      label: "My requests",
      query_name: "Query name",
      new_label: "Add to my requests...",
      new_dialog_title: "Add the current query to my requests",
      remove_label: "Remove from my requests",
      remove_label_with_name: 'Remove "%{name}" from my requests',
      remove_dialog_title: "Remove from my requests?",
      remove_message:
        "Are you sure you want to remove this query from your list of requests?",
      help: "Filter the list and add this query to your list",
    },
  },
  pos: {
    certificates: {
      name: "Certificate name",
      issuer: "Issuer",
      is_active: "Status",
    },
    accessPoints: {
      warehouse_name: "Warehouse name",
      ip_address: "IP address",
      ap_software: "Software",
      is_active: "Status",
    },
    warehouses: {
      name: "Name",
      country: "Country",
      district: "District",
      city: "City",
      zip_code: "Postal code",
    },
    logs: {
      type: "Category",
      timestamp: "Date/Time",
    },
    labels: {
      search: "Search by name",
      searchTitle: "Search by title",
      active: "Active",
      inactive: "Inactive",
    },
    menu: {
      config: "Configuration",
      security: "Security",
      accessPoints: "Access Points",
      warehouses: "Warehouses",
      certificates: "Certificates",
      monitoring: "Monitoring",
      language: "Language",
    },
    language: "Language",
  },
  resources: {
    "app-users-sessions": {
      name: "Sessions",
      fields: {
        app_id: "Application",
        validity: "Validity",
      },
    },
    accessPoints: {
      list: "Network Devices",
      manage: "Access management",
      name: "Access Points",
      fields: {
        warehouse_id: "Warehouse",
        location_description: "Location",
        ip_address: "IP address",
        ap_software: "Software",
        created_date: "Creation date",
        is_active: "Status",
      },
    },
    certificates: {
      name: "Certificates",
      list: "Certificate management",
      upload: "Upload files",
      validations: "Validations",
      fields: {
        name: "Name",
        file_path: "File path",
        issue_date: "Issue date",
        expiration_date: "Expiration date",
        issuer_name: "Issuer",
        is_active: "Status",
      },
    },
    warehouses: {
      manage: "Warehouse panel",
      map: "Geographic map",
      name: "Warehouse",
      list: "Warehouse",
      fields: {
        name: "Name",
        zip_code: "Zip Code",
        city: "City",
        country_id: "Country",
      },
    },
    monitoring: {
      status: "Network Status",
      logs: "Activity Logs",
    },
    logs: {
      name: "Logs",
      fields: {
        category: "Category",
        message: "Message",
        timestamp: "Date/hour",
        history: "History",
      },
    },
    users: {
      name: "Users |||| %{smart_count} Users",
      blocked_users: "Blocked Users",
      deleted_users: "Deleted Users",
      fields: {
        name: "Name",
        username: "Username",
        email: "Email",
        nif: "NIF",
        password: "Password",
        confirm_password: "Confirm Password",
        show_password: "Show Password",
      },
      error: {
        confirm_password: "The passwords doesn't match",
      },
    },
    utilizadores: {
      name: "Users",
      edit_title: "Edit User",
      create_title: "Create User",
      validate: "Validate users",
      logs: "Restricted accounts",
      tabs: {
        prefs_util: "Preferences",
      },
      fields: {
        nome: "Name",
        morada: "Address",
        nif: "Tax Identification Number",
        nic: "Civil Identification Number",
        cc: "Citizen Card",
        telefone: "Phone",
        telemovel: "Mobile",
        password: "Password",
        foto: "Image",
        ativo: "Active",
        ult_acesso: "Last access",
        roles: "Roles",
        username: "Username",
        confirm_password: "Confirm password",
        cod_postal: "Postal code",
        validation_date: "Validation date",
        tema_fav: "Theme",
        lang_fav: "Language",
        use_email: "Use email?",
      },
      field_validation: {
        password:
          "Password must be 6 characters long, including at least one number",
        email: "Cannot contain the following characters: !#$%&'*+/?^`{|}()~",
        name: "Only letters and the following characters: _-.",
        telefone: "Must be a valid phone number: 00000000",
        telemovel: "Must be a valid mobile number: 00000000",
        nif: "Must be a valid tax identification number: 00000000",
        nic: "Must be a valid commercial identification number: 00000000",
        cc: "Must be a valid citizen card: 0000000000 (10)",
        username: "Can only contain letters and the following characters: _",
        cod_postal: "Only numbers and the following characters: -.@[]-",
      },
    },
    role: {
      name: "Roles",
      edit_title: "Edit Role",
      create_title: "Create Role",
      fields: {
        nome: "Description",
      },
    },
    armazem: {
      name: "Warehouse/Park |||| Warehouses/Parks",
      edit: {
        title: "Warehouse",
      },
      fields: {
        designacao: "Designation",
        descricao: "Description",
        localizacao: "Location",
        get_localizacao: "Determine GPS Coordinates",
        localizacao_geo: {
          x: "Latitude",
          y: "Longitude",
        },
        horario: "Schedule",
        horario_id: "Schedule",
        local_id: "Location",
        entidade_id: "Entity",
        show_entidade: "View Entity Data",
        atributosArmazem: {
          atributo_id: "Characteristic",
        },
        equipamentos: {
          tipo_id: "Type",
          descricao: "Description",
          limite_min: "Min Limit",
          limite_max: "Max Limit",
          unidades: "Units",
        },
        morada: "Address",
        regiao: "Region",
        rua: "Street",
        pais: "Country",
        pais_id: "Country",
        cidade: "City",
        cod_postal: "Postal Code",
        linha_1: "Line 1",
        linha_2: "Line 2",
        linha_3: "Line 3",
        pessoa_contacto: "Contact person",
        contactos: "Contacts",
        contacto_princ: "Main contact",
        contacto_alt: "Alternative contact",
        contacto_sos: "Emergency contact",
        email_princ: "Main email",
        email_alt: "Alternative email",
        images: "Images",
        pdf: "Documents",
        classif: "Order",
        app_users_id: "Associated User",
        url_principal: "Main URL",
        url_secondario: "Secondary URL",
      },
    },
    entidade: {
      name: "Entity |||| Entities",
      fields: {
        nome: "Name",
        nif: "NIF",
        telefone: "Phone",
        email: "Email",
        morada: "Address",
        rua: "Street",
        pais: "Country",
        cidade: "City",
        cod_postal: "Postal Code",
        linha_1: "Line 1",
        linha_2: "Line 2",
        linha_3: "Line 3",
        pessoa_contacto: "Contact person",
        imagem: "Image",
        url_empresa: "Warehouse URL",
      },
    },
  },
  show: {
    register: {
      password_requirements: "The password must contain:",
      min_8_chars: "At least 8 characters",
      uppercase: "An uppercase letter",
      lowercase: "A lowercase letter",
      number: "A number",
      special_char: "A special character",
    },
    accessPoints: {
      location_description: "Location",
      ip_address: "IP address",
      software: "Software",
      software_version: "Software version",
      permissions: "Permissions",
      is_active: "Active",
      certificates: "Certificate",
      warehouse: "Warehouse",
      created_date: "Creation date",
      last_modified: "Last modified",
      last_modified_user: "Modified by",
      logs: "Logs",
      configuration: "Technical Configuration",
      identification: "Identification",
      pdf: {
        title: "Access Points List",
        warehouse: "Warehouse",
        location: "Location",
        ip: "IP Address",
        software: "Software",
        status: "Status",
        active: "Active",
        inactive: "Inactive",
        export: "Export",
      },
    },
    certificates: {
      identification: "Identification",
      name: "Name",
      file_path: "File path",
      issuer_name: "Issuer name",
      issuer_url: "Issuer URL",
      issue_date: "Issue date",
      expiration_date: "Expiration date",
      is_active: "Active",
      certificate_text: "Text",
      certificate_data: "Data",
      modified_by: "Modified by",
      details: "Details",
      logs: "Logs",
      content: "Content",
      last_modified: "Last Modified",
      srv_cert: "Server Certificate (SC)",
      int_cert: "Intermediate Certificate (CA)",
      priv_key: "Private Key (PK)",
      edit_instruction: "To edit a certificate, click the 'Edit' button below each field. Changes will only be saved when you click 'Save'.",
      pdf: {
        export: "Export",
        title: "Certificate List",
        name: "Name",
        issuer: "Issuer",
        issueDate: "Issue Date",
        expirationDate: "Expiration Date",
        inactive: "Inactive",
      },
      upload: {
        ssl_certificates: "SSL Certificates",
        upload_instructions: "Upload your SSL certificates to associate them with an access point.",
        drag_drop_text: "Drag and drop your files here",
        supported_files: "Supported files: .zip, .crt, .pem, .key, .ca-bundle",
        uploaded_files: "Uploaded files",
        server_certificate: "Server Certificate",
        private_key: "Private Key",
        intermediate_certificate: "Intermediate Certificate",
        no_file_uploaded: "No file uploaded",
        replace_file: "Replace file",
        file_exists: "A file already exists for",
        replace_question: "Do you want to replace it?",
        file_uploaded_success: "File uploaded successfully",
        invalid_zip_file: "Invalid ZIP file",
        error_process_zip: "Error processing ZIP file",
        unsupported_file_format: "Unsupported file format",
        all_fields_required: "All fields are required",
        access_points: "Access Points",
        access_points_info: "Select an access point to associate the certificates.",
        select_access_point: "Select an access point",
        inactive: " (Inactive)",
        loading: "Loading...",
        submit: "Submit",
        cancel: "Cancel",
        confirm: "Confirm",
        error_fetch_access_points: "Error fetching access points",
        error_send_certificates: "Error sending certificates",
        error_associate_access_point: "Error associating with the access point",
        certificates_sent_success: "Certificates sent successfully",
        error_process_operation: "Error processing the operation",
      },
    },
    warehouses: {
      identification: "Identification",
      name: "Name",
      address: "Address",
      city: "City",
      district: "District",
      country: "Country",
      zip_code: "Postal code",
      email: "Email",
      contact: "Contact person",
      phone: "Phone",
      website: "Website",
      created_date: "Creation date",
      last_modified: "Last modified",
      last_modified_user: "Modified by",
      location: "Location",
      contacts: "Contacts",
      logs: "Logs",
      map: "Map",
      latitude: "Latitude",
      longitude: "Longitude",
      pdf: {
        title: "Entity List",
        name: "Name",
        address: "Address",
        country: "Country",
        export: "Export",
      },
    },
    validateUsers: {
      person_name: "Person Name",
      nif: "Tax Identification Number",
      email: "Email",
      validation_date: "Validation Date",
    },
    dashboard: {
      warehouses_title: "Warehouses",
      warehouses_total: "Total Warehouses",
      countries: "Countries",
      recent_updates: "Recent Updates",
      error_loading_statistics: "Error loading statistics.",
      logs_title: "Logs",
      error_loading_logs: "Error loading logs.",
      no_logs_found: "No logs found.",
      status_offline: "OFFLINE",
      status_connecting: "CONNECTING",
      log_type: {
        info: "Information",
        error: "Error",
        warning: "Warning",
        debug: "Debug",
        security: "Security",
        audit: "Audit",
        unknown: "Unknown",
      },
      status_title: "Domibus Status",
      status_normal: "Normal",
      status_warning: "Warning",
      status_critical: "Critical",
      error_network_response: "Network response error.",
      error_request_failed: "Request failed.",
      certificates_title: "Certificates",
      certificates_total: "Total Certificates",
      status_active: "Active",
      status_expired: "Expired",
      status_expiring: "Expiring Soon",
      certificates_no_found: "No certificates found.",
      access_points_title: "Access Points",
      access_points_total: "Total Access Points",
      access_points: "Access Points",
      access_points_no_found: "No access points found.",
      status_inactive: "Inactive",
    },
    users: {
      name: "Name",
      username: "Username",
      role: "Role",
      person_name: "Person Name",
      nif: "NIF",
      cc: "Citizen Card",
      nic: "NIC",
      address: "Address",
      post_code: "Postal Code",
      phone: "Phone",
      mobile: "Mobile",
      email: "Email",
      active: "Active",
      blocked: "Blocked",
      deleted: "Deleted",
      validation_date: "Validation Date",
      last_access: "Last Access",
      personal_info: "Personal Information",
      contacts: "Contacts",
      status: "Status",
      logs: "Logs",
      roles: {
      user: "User",
      admin: "Administrator",
      },
    },
    logs: {
      details: "Log Details",
      type: "Type",
      message: "Message",
      timestamp: "Date/Time",
      data: "Metadata",
      metadata: {
        key: "Key",
        value: "Value",
      },
    },
  },
};

export default englishMessages;
