# band_manager_app

## Project Setup

To set up your development environment, follow these steps:

### 1. Clone the repository to your local machine using Git:

```
https://github.com/yuandasp/band_manager_app.git
```

### 2. Install project dependencies using npm:

```
npm install
```

### 3. Fill the .env file using the given template on .env.template

### 4. Import or create new schema for database on MySQL

You need to create two schemes of database, for testing (db_band_manager_test) and for storing the real data (db_band_manager)

//image

## Running the code

```
npm start
```

## Running the test

```
npm test
```

## REST API

### Create a new band

1. Route `/band`
2. Method `POST`
3. Payload

```
{
    "name": "S Band",
    "max_personnel": 3
}
```

4. Response

```
{
message:  "Success create new band!"
}
```

### Create a new personnel

1. Route `/personnel`
2. Method `POST`
3. Payload

```
{
    "name": "Siti",
    "position": "Vocalist"
}
```

4. Response

```
{
message:  "Success create new personnel!"
}
```

### Get list of all bands

1. Route `/band`
2. Method `GET`
3. Response

```
{
message: "Success get all bands!",
data:  {
        "band_id": 1,
        "name": "S Band",
        "max_personnel": 3
        }
}
```

### Get details of a band

1. Route `/band/:band_id`
2. Method `GET`
3. Response

```
{
"message": "Success get details of the band!",
"data": {
        "name": "S band",
        "members": [
            {
            "name": "Siti",
            "position": "Vocalist"
            }
        ]
    }
}
```

### Update band info

1. Route `/band/:band_id`
2. Method `PUT`
3. Payload

```
{
    "name": "Y Band",
    "max_personnel": 4
}
```

4. Response

```
{
message: "Update band info is success!"
}
```

### Add personnel into a band

1. Route `/band/personnel`
2. Method `PATCH`
3. Payload

```
{
    "band_id": 1,
    "personnel_id": 1
}
```

4. Response

```
{
message: "Success add personnel into the band!"
}
```
