# Oslo Elm Day Signup: AWS-oppsett
Oppsett for endepunkt som putter epost i en tabell i DynamoDB


## Opprett DynamoDB
- Create table
  - Table name: OsloElmDaySignups
  - Primary key: email
    - type String
- Use default settings
- Kopier Amazon Resource Name (ARN) fra Overview-fane


## Opprett policy for tabell
- Gå til Servies > IAM > Policies.
  - Create policy
  - Service: DynamoDB
  - Access level: PutItem (under Write)
  - Klikk "Resources"
  - Add ARN to restrict access
  - Lim inn ARN for DynamoDB-tabellen som du kopierte i "Specify ARN..."
  - Add
  - Review policy
    - Name: PutOsloElmDaySignups
    - Description: Kan putte eposter inn i OsloElmDaySignups-tabellen
    - Create policy


## Opprett Lambda Function og API Gateway
- Services > Lambda > Functions > Create function
- Author from scratch
- Name: osloElmDaySignup
- Runtime: Node.js 8.10
- Role: Create new from templates
  - Role name: osloElmDaySignup
- Create function
- Add triggers: API Gateway
  - Configure triggers
  - API: Create a new API
  - Security: Open
  - Add
- Trykk på lambda-funksjonen (osloElmDaySignup)
- Erstatt koden i index.js med lambda.js
- Save (øverst til høyre)


## Konfigurer rolle med DB policy
- Gå til Servies > IAM > Roles
  - Klikk på osloElmDaySignup
  - Attach policies
  - Søk etter PutOsloElmDaySignups
  - Huk av
  - Attach policy