import { HTTP } from 'meteor/http';

export const loginGen = (loginRequest) => {

  if(!loginRequest.email || !loginRequest.pwd) {
    return null;
  }

    const response = HTTP.call( 'POST', `${Meteor.settings.endpoint}/${Meteor.settings.module}/person/authenticatetoken`, {
      params: {
        "email": loginRequest.email,
        "pwd": loginRequest.pwd,
        "tokenName": "wekan"
      }
    });
    console.log(response);
    if(response && response.data && response.data.result === true && response.data.id){

      let userId = null;
      let retourId = null;

      if(response.data.id && response.data.id.$id){
        retourId = response.data.id.$id;
      }else{
        retourId = response.data.id;
      }
      console.log(response.data.account.email);

      //ok valide
      var userM = Meteor.users.findOne({'_id':retourId});
      console.log(userM);
      const token = response.data.token ? response.data.token : false;
      if(userM){
        //Meteor.user existe
        userId= userM._id;
        if (token) {
          Meteor.users.update(userId, {
            $set: {
              token
            }
          });
        }
        Meteor.users.update(userId,{$set: {name: response.data.account.name,
        emails: [{ address: response.data.account.email, verified: true }]}});
        if(response.data.account.profilThumbImageUrl){
          Meteor.users.update({ _id: userId},{ $set: { 'profile.avatarUrl': `${Meteor.settings.urlimage}${response.data.account.profilThumbImageUrl}` } })
        }
      }else{
        //Meteor.user n'existe pas
        //username ou emails

        const newUser = {
          _id:retourId,
          username: response.data.account.username,
          name: response.data.account.name,
          emails: [{ address: response.data.account.email, verified: true }],
          createdAt: new Date()
        };


        if(response.data.account.email==='thomas.craipeau@gmail.com'){
          newUser.isAdmin = true;
        }

        userId = Meteor.users.insert(newUser);
        if (token) {
          Meteor.users.update(userId, {
            $set: {
              token
            }
          });
        }
      }


      const stampedToken = Accounts._generateStampedLoginToken();

      Accounts._insertLoginToken(userId, stampedToken);
      /*Meteor.users.update(userId,
        {$push: {'services.resume.loginTokens': stampedToken}}
      );*/
      //this.setUserId(userId);
      const tokenExpiration = Accounts._tokenExpiration(stampedToken.when);

      if(response.data.account.profilThumbImageUrl){
        Meteor.users.update({ _id: userId},{ $set: { 'profile.avatarUrl': `${Meteor.settings.urlimage}${response.data.account.profilThumbImageUrl}` } })
      }
      console.log(userId);
      return {
        userId: userId,
        token: stampedToken.token,
        tokenExpires: tokenExpiration,
      }
    }else{
      if(response && response.data && response.data.result === false){
        throw new Meteor.Error(Accounts.LoginCancelledError.numericError, response.data.msg);
      } else if(response && response.data && response.data.result === true && response.data.msg){
        throw new Meteor.Error(response.data.msg);
      }

    }
}
