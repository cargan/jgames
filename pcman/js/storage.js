//used for storing user name :)
var Storage = {
    saveData: function(name, value) {
      return localStorage.setItem(name, JSON.stringify(value));
    },
    getData: function(name) {
      var data = localStorage.getItem(name);
      return JSON.parse(data);
    }
};
