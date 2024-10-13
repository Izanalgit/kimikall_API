# kimikall_API
En construcción ...

## END ROUTES

- MESSAGES
    - READ MESSAGES
        - {params: contact} (userId)
    + SEND MESSAGE
        - {payload:{recep,message}} (userId, string message)
    
* PRIVACY
    - REPORT ACOUNT
        - {payload:{reportUser,problem}} (userId, string message)
    * BLOCK ACOUNT
        - {payload:{blockUser}} (userId)
    * GET BLOCKED ACOUNTS
    + UNBLOCK ACOUNT
        - {payload:{unblockUser}} (userId)

* USER
    - ACOUNT
        - CREATE USER
            - {params: userKey} (token Key)
        * UPDATE USER
            - {payload:{name,email,pswd}} (string name, string email, string password)
        + DELETE USER
            - {payload:{email,pswd}} (string email, string password)
    + ACCES
        - SING UP
            - {payload:{name,email,pswd}} (string name, string email, string password)
        * LOG IN
            - {payload:{email,pswd}} (string email, string password)
        + LOG OUT

* PRORFIL
    - UPDATE PROFIL
        - {payload:{profile,extended}} (profile object, extended profile object)
    * UPLOAD IMAGE PROFILE
        - {params: imageType} (string image type)
        + {file:image} (file image)
    * GET OWN PROFIL
    + GET CONTACT PROFIL
        - {params: contact} (userId)

* CONTACTS
    - ADD CONTACT 
        - {payload:{newContact}} (userId)
    * DELTE CONTACT
        - {payload:{removeContact}} (userId)
    * GET CONTACTS
    * REQUEST CONTACTS
        - {payload:{newContact}} (userId)
    + SEARCH CONTACTS
        - {payload:{normalSearch,expandedSearch}} (search forms)

* TOKEN
    - GET INFO ACOUNT
    * BUY TOKEN TIME
    + BUY TOKEN MESSAGE

+ ADMIN
