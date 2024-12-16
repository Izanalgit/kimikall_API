# kimikall_API

Developed project using MERN stack. Authenticated users can send encrypted messages with double-layer
security (E2EE and AES-256-CBC with IV). API supports user registration with email verification, password recovery, and CRUD operations for user profiles. Integrated a token-based system allowing unlimited messaging for premium users. Implemented various security measures to ensure data integrity and prevent abuse.

## Encryption diagram

![Encryption Diagram](docs/diagram-encryption.png "Diagram of Encryption Layers")

## END ROUTES

- MESSAGES {headers : Authorization} (key token)
    - READ MESSAGES
        - {params: contact} (userId)
    - READ OLDER MESSAGES
        - {params: contact/lastDate} (userId)
    * COUNT UNREAD MESSAGES
    * CHECK READ MESSAGES
        - {params: message} (messageId)
    + SEND MESSAGE
        - {payload:{recep,message}} (userId, string message)
    
* PRIVACY {headers : Authorization} (key token)
    - REPORT ACOUNT
        - {payload:{reportUser,problem}} (userId, string message)
    * BLOCK ACOUNT
        - {payload:{blockUser}} (userId)
    * GET BLOCKED ACOUNTS
    + UNBLOCK ACOUNT
        - {payload:{unblockUser}} (userId)

* USER {headers : Authorization} (key token)
    - ACOUNT
        - CREATE USER (no header)
            - {params: userKey} (token Key)
        * UPDATE USER
            - {payload:{name,email,pswd}} (string name, string email, string password)
        + DELETE USER
            - {payload:{email,pswd}} (string email, string password)
    * ACCES
        - SING UP (no header)
            - {payload:{name,email,pswd}} (string name, string email, string password)
        * LOG IN
            - {payload:{email,pswd}} (string email, string password)
        + LOG OUT
    * RECOVER ACOUNT
        - GET FORGOTEN PASSWORD (no header)
            - {payload:{email}} (string email)
        + CHANGE FORGOTTEN PASSWORD (no header)
    + PAIR KEYS
        - GET PRIVATE KEY PASSWORD

* PRORFIL {headers : Authorization} (key token)
    - UPDATE PROFIL
        - {payload:{profile,extended}} (profile object, extended profile object)
    * UPLOAD IMAGE PROFILE
        - {params: imageType} (string image type)
        + {file:image} (file image)
    * DELETE IMAGE PROFILE
        - {params: imageType} (string image type)
    * GET OWN PROFIL
    + GET CONTACT PROFIL
        - {params: contact} (userId)

* CONTACTS {headers : Authorization} (key token)
    - ADD CONTACT 
        - {payload:{newContact}} (userId)
    * DELTE CONTACT
        - {payload:{removeContact}} (userId)
    * GET CONTACTS
    * REQUEST CONTACTS
        - {payload:{newContact}} (userId)
    + SEARCH CONTACTS
        - {payload:{normalSearch,expandedSearch}} (search forms)

+ TOKEN {headers : Authorization} (key token)
    - COUNT TOKENS
    + PROVISIONAL ADD TOKENS
        - {params: tokenType} (string token type)

