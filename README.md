# crudpluginObject

WHAT: This project is a Plugin that can help manage all CRUD operations by taking a mongoose model plus the JSON payload and will execute the desired action i.e. C, R, U or D. A similar implementation can be found at [CRUDPlugin](https://github.com/daser/crudpluginModified) except that in this particular implementation, access to CRUD functionalities are exposed through an object.


WHY: This plugin is aimed at freeing other services (in a microservice architecture) which leverage CRUD to define their data models and route handlers which will internally leverage CRUD functionality.

HOW: The plugin exposes all the functions which provide CRUD implementation on data models. In summary,  this plugging will be the main source or entry point of all CRUD requests. A good example is USER... this defines 'user' data model with various fields to differntiate between the various types of users (normal, admin, superuser) ..., Take note that USER would also handle the dbase connection.

So USER leverages CRUD by 'importing' it via NPM.

Next it passes the dbase connection and required model into the CRUD 'constructor'..
Then the route handlers would intercept the requests and call the functionality exposed by CRUD

## Requirements
* NodeJS

## Setup
* clone Repository containing the project using `git clone git@github.com:daser/crudpluginObject.git`
* cd into the newly created crudpluginObject directory
* Run `npm install` to install the needed node js packages.

## How to run
Run this command to run the application `NODE_ENV=development node server.js`




## Docomentation

To install the plugin into your project:

```npm install crudpluginobject --save```


To include it into your file

```var crudplugin = require('crudpluginobject').CrudPlugin;```


For instance if you have a 'User' model, to create a new record for user, assuming the model has a field called 'email' that you want returned on successful creation:

```     var crud = new crudplugin(User);
```

<b>
Method: create
</b>

```
crud.create(req.body.record)
.then(record=>{
   return res.status(200).json(record.email);
}).catch(err => {
  return res.status(500).json("A little error");
})
```

<b>
Method: deleteRecord</b>

```
crud.deleteRecord(req.body.property, req.body.value)
.then(user=> {
    if (user)
    {
        return res.status(200).json(user.username);
    }
    else {
        return res.status(500).json("some error");
    }
}).catch(err => {
    return res.status(500).json("a little error");
});
```

req.body.property is the field name and req.body.value is the value i the field you want a match to be deleted.

   	Take for instance this request structure:
```   
{
    "property":"email",
    "value" : "daser@nhubnigeria.com"
}
```
It would mean delete the record with email equals to daser@nhubnigeria.com


<b>Method: getRecordByProperty</b>

Fetching a single record can come in handy with the following snippets:

```
crud.getRecordByProperty(req.body.property, req.body.value)
.then(user => {
    if (user) {
        console.log('Successfully retrieved user ' + user.email);
        return res.status(200).json(user);
    }
    else {
        console.log('Could not find user ');
        return res.status(200).json(false);
    }
}).catch(err => {
    return res.status(500).json("a little error");
});
```

req.body.property is the field name and req.body.value is the value i the field you want a match to be queried.

   	Take for instance this request structure:
```
{
    "property":"username",
    "value" : "daser"
}
```
 	 It would mean fetch the record with username equals to daser

<b>Method: updateRecords</b>
This updates multiple fields in the model given some matching criteria.
```
crud.updateRecords(property, value, ["lastname","firstname"], ["kabam","Jurun"])
.then(value => {
    return res.status(200).json(value);
})
.catch(err => {
    return res.status(500).json("a little error");
});
```
property and value parameters works as previously seen, the third parameter is an array containing field names in the model with a corresponding values in the fourth parameter. Note that validation check is in place to ensure that their is a match otherwise an exception would be thrown.


<b>Method: updateRecord</b>
This updates a single field in the model given some matching criteria.

```
crud.updateRecord(property, value, "firstname", "Longji")
.then(value => {
    return res.status(200).json(value);
})
.catch(err => {
    return res.status(500).json("a little error");
});
```
property and value parameters works as previously seen, based on the matching criteria, we we changing "firstname" to "Longji".

Note the difference between: updateRecords and updateRecord (one is plural while the other is singular)


## Contributors
[Daser David](https://github.com/daser)


