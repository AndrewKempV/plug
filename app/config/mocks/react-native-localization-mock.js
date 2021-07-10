const interfaceLanguage = 'en';

class RNLocalization {
  constructor(props) {
    this.props = props;
    this.setLanguage(interfaceLanguage);
  }

  setLanguage(interfaceLanguage) {
    const currentLanguage = interfaceLanguage;
    this.language = currentLanguage;
    //Associate the language object to the property
    if (this.props[currentLanguage]) {
      //console.log("There are strings for the language:"+this.language);
      var localizedStrings = this.props[this.language];
      for (var key in localizedStrings) {
        //console.log("Checking property:"+key);
        if (localizedStrings.hasOwnProperty(key)) {
          //console.log("Associating property:"+key);
          this[key] = localizedStrings[key];
        }
      }
    }
  }
}

export default RNLocalization;