import G_G from "./G_G.js";
import { G_Bus } from "./G_Bus.js";
export class _front extends G_G{
  constructor() {
		super();
    const _ = this;
    _.componentName = 'front';
    //_.view = new View(null);
/*    _.ctrl = new Ctrl(null, _.view, {
      container: document.querySelector('body')
    });*/
    _.libs = new Map();
    _.components = new Map();
    _.busEvents= [
      'registerUser', 'frontLogin','frontLogout','chooseLang','createOrder'
    ];
    //
   
    //
    //_.init();
  }
	define(){}
  init(){
    const _ = this;
  }

}