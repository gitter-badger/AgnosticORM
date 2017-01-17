import 'babel-polyfill';


import Agnostic from './Agnostic';
import User from "./examples/User";


let orm = new Agnostic();


orm.getRepository(User).query
    .where('id', 1)
    .get()
    .then(::console.log);
