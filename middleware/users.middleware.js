import express from 'express';
import UsersService from '../services/users.service.js';


class UsersMiddleware {
 
    isValidUser(value) {

        const isValidUser =  (value => {
            return UsersService.getUserByEmail(value).then(user => {
              if (user) {
                return Promise.reject('E-mail already in use');
              }
            });
          })(value);
        return isValidUser;
    }
}



export default new UsersMiddleware();