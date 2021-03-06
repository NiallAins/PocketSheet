const defaultUserData = '{"new":true,"name":"","stats":[10,10,10,10,10,10],"savingThrow":[],"spellSlots":[[2,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],"init":10,"profSkills":[],"prof":2,"speed":30,"hp":10,"maxHp":10,"level":1,"race":"","class":"","subclass":"","align":"","desc":"","traits":"","equipment":[],"spells":[],"features":[],"notes":[]}';

export default {
  data: {},
  permissionCheck: false,

  set: function(name, value) {
    if (typeof name === 'object') {
      for (let key in name) {
        this.data[key] = name[key];
      }
    } else {
      this.data[name] = value;
    }
    this.saveData();
  },

  setItem: function(type, item, remove = false) {
    if (remove) {
      let itemIndex = this.data[type].findIndex(i => i.index === item);
      if (itemIndex !== -1) {
        this.data[type].splice(itemIndex, 1);
      }
    } else {
      this.data[type].push(item);
      this.data[type].sort((a, b) => a.index - b.index);
      if (type === 'spells') {
        this.data[type].sort((a, b) => a.level - b.level);
      } else if (type === 'equipment') {
        let sortOrder = {
          'Armour': 0,
          'Weapon': 1,
          'Ammunition': 2,
          'Item': 3
        }
        this.data[type].sort((a, b) => sortOrder[a.type] - sortOrder[b.type]);
      }
    }
    this.saveData();
  },

  toggleItemParam: function(type, itemIndex, param, value) {
    let item = this.data[type].find(i => i.index === itemIndex);
    item[param] = (typeof value !== 'undefined' ? value : !item[param]);
    this.saveData();
  },

  loadData: function() {
    let data = localStorage.getItem('userData');
    if (data) {
      this.data = JSON.parse(data);
    } else {
      this.data = JSON.parse(defaultUserData);
      this.saveData();
      console.log('No saved data, default data set');
    }
  },

  saveData: async function() {
    if (!this.permissionCheck) {
      let hasPerm = await navigator.storage.persisted();
      console.log('Persistant Storage ' + (hasPerm ? 'already granted' : 'not yet granted'));
      
      if (!hasPerm) {
        let setPerm = await navigator.storage.persist();
        console.log('Persistant Storage ' + (setPerm ? 'now granted' : 'refused'));
      }
      
      this.permissionCheck = true;
    }

    let data = JSON.stringify(this.data)
    localStorage.setItem('userData', data);
  }
}