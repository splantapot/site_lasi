import { get_public_path, get_template_path } from './src/path_util.js';

const index_path = get_public_path('members.html', 'membros', 'em');
console.log(index_path);

const index_template_path = get_template_path('index.ejs');
console.log(index_template_path);