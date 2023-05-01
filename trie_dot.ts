
const end_shape = '[shape=diamond]';

function lines(text: string): Array<string> {
    let delete_whitespace = (str) => str.replace(/\s/g, '');
    return text.split("\n").map(delete_whitespace); // Should probably handle other line endings
}

function transform(text: string): string {

   let ret = '    START';
   let top = '';
   if(text.length == 0){
       // Remove empty lines
       return '';
   }

   for (let i = 0; i < text.length; i++){
        ret += `->${text.slice(0,i+1)}`;
        if( i == text.length-1) {
            top += `${text.slice(0,i+1)}[label=${text[i]} shape=diamond];\n`;
        } else {
            top += `${text.slice(0,i+1)}[label=${text[i]}];\n`;
        }
   }

   // TODO: Mark this as special - text[i] + '_' + i; 
   const diamond = ''; //`${text[text.length-1]}_${text.length-1}${end_shape};`;

   return top + ret + ";\n" + diamond + "\n"
}

function get_graph(corpus: string): string {

    const header = `strict digraph Trie {` + '\n';
    const footer = `}`;

    // Turn string into list of words
    let words = lines(corpus)

    let graph = words.map(transform)

    return header + graph.join('') + footer;
}

function get_graphs_with_text(corpus: string, text: string): Array<string> {

    const original_graph = get_graph(corpus)

    /*
    Ok, so we're being a bit cheeky here.
    Rather than actually building the graph, we're instead using
    string checks and the known naming convention of the nodes
    */

    const is_in_text = `${text}[label=${text[text.length-1]} shape=diamond]`;
    const is_in = original_graph.includes(is_in_text);

    const make_bold = is_in?'[color="green" penwidth=4]':'[color="red" penwidth=4]';

    let graphs = [];
    let running = original_graph.replace('{', `{\nSTART${make_bold}`);
    let old = '';
    for(let i = 0; i < text.length; i++){
        const name = text.slice(0, i+1);
        if(original_graph.includes(name + '[')){
            if( i == 0 ){
                running = running.replace('{', `{\nSTART->${name}${make_bold};`);
                graphs.push(`${running}`)
            } else {
                running = running.replace('{', `{\n${old}->${name}${make_bold};`);
                graphs.push(`${running}`)
            }
            running = running.replace('{', `{\n${name}${make_bold};`);
            graphs.push(`${running}`)
        } else {
            break;
        }
        old = name;
    }

    return graphs
}
