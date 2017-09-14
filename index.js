'use strict';

const
  error_codes = require('./lib/errorMessages').error_codes,
  modelValidation = require('./lib/modelValidation'),
  Promise = require('bluebird'),
   _ = require("lodash");



 // var Crud = (model) => {

function Crud(Model) {

    this.model = Model;

    Crud.prototype.create = function(properties){
          var self = this;
          var Model = self.model;
          if(!properties || !Model)
          {
              return Promise.reject(error_codes.MissingFields); 
          }else if(!_.isObject(Model)){
              return Promise.reject(error_codes.NotAnObject);
         }
        for (var prop in properties) {
            if (properties.hasOwnProperty(prop)) {
                if (!modelValidation.validateProperty(Model, prop)) {
                    console.log('Invalid Property: ' + prop);
                    return Promise.reject(error_codes.ResourceNotValid);//ResourceNotValid
                }
            }
        }
        const newRecord = new Model(properties);
        return newRecord.save();

    };

    Crud.prototype.getRecordByProperty = function(property, value){
          var self = this;
          var Model = self.model;
          if (!property || !value || !Model)
          {
              return Promise.reject(error_codes.MissingFields);
          }else if(!_.isObject(Model)){
              return Promise.reject(error_codes.NotAnObject);
          }


          if (modelValidation.validateProperty(Model, property))
          {
              var query={};
              query[property]= value;
              return Model.findOne(query).exec();
          }
          else {
              return Promise.reject(error_codes.ResourceNotValid);
          }

    };


    Crud.prototype.deleteRecord = function(property, value){
          var self = this;
          var Model = self.model;

      
          if (!property || !value) {
              return Promise.reject(error_codes.MissingFields); //MissingFields
          }else if(!_.isObject(Model)){
              return Promise.reject(error_codes.NotAnObject);
          }

          if (modelValidation.validateProperty(Model, property)) {
              var query = {};
              query[property] = value;
              console.log("DLEETE RECORD " + JSON.stringify(query));
              return Model.findOneAndRemove(query).exec();
          }
          else {
              return Promise.reject(error_codes.ResourceNotValid); //ResourceNotValid    
        }    

};



    Crud.prototype.updateRecords= function(queryParam, queryVal, properties, values){
        var self = this;
        var Model = self.model;

        if (!Model || !property || !value || !queryParam || !queryVal) {
            return Promise.reject(error_codes.MissingFields); //MissingFields
        }else if(!_.isObject(Model)){
            return Promise.reject(error_codes.NotAnObject);
        }

        return modelValidation.getModelByProperty(Model, queryParam, queryVal)
            .then(rec => {
                if (rec) {
                    if (modelValidation.validateProperty(Model, property)) {
                        rec[property] = value;
                        return rec.save();
                    }
                    else {
                        return Promise.reject(error_codes.ResourceNotValid);//ResourceNotValid
                    }
                }
                else {
                    console.log('The record doesnt exist');
                    return Promise.reject(error_codes.ResourceNotExist); //UnknownError
                }

            }).then(rec => {
                return rec;
            }).catch(err => {
                return Promise.reject(err);
            });

};


  Crud.prototype.updateRecords = function(queryParam, queryVal, properties, values){

    var self = this;
    var Model = self.model;

    if (!queryVal || !queryParam || !properties || !values || !Model) {
        return Promise.reject(error_codes.MissingFields);
    }else if(!_.isObject(Model)){
        return Promise.reject(error_codes.NotAnObject);
    }
    else if (!Array.isArray(properties) || !Array.isArray(values)) {
        return Promise.reject(error_codes.ResourceNotValid);
    }
    else if (properties.length != values.length) {
        return Promise.reject(error_codes.ResourceNotValid);
    }

    return modelValidation.getModelByProperty(Model, queryParam, queryVal)
        .then(rec => {
            if (rec) {
                for (var i in properties) {
                    if (properties.hasOwnProperty(i)) {
                        let property = properties[i];
                        if (modelValidation.validateProperty(Model,property)) {
                            rec[property] = values[i];
                        }
                        else {
                            return Promise.reject(error_codes.ResourceNotValid);//ResourceNotValid
                        }
                    }
                }
                return rec.save();
            }
            else {
                console.log('The record ' + queryVal + ' doesn\'t exist');
                return Promise.reject(error_codes.ResourceNotExist); //UnknownError
            }

        }).then(rec => {
            return rec;
        }).catch(err => {
            return Promise.reject(err);
        });
  };



}//end of class





module.exports.CrudPlugin = Crud;