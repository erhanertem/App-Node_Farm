//NOTE ABOUT COMMONJS - REQUIRE-MODULE.EXPORT VS ES6 - IMPORT-EXPORT
//You can't selectively load only the pieces you need with require but with import, you can selectively load only the pieces you need, which can save memory.Loading is synchronous(step by step) for require on the other hand import can be asynchronous(without waiting for previous import) so it can perform a little better than require.
//require: entire file is imported, selective functions or pieces can't be imported. Hence , memory wastage. Old school way of importing. import: ES6 introduced which allow us to asynchronously import modules and selective pieces of it, thus an improvement over the old way. Why use require at all then?Because require allows us to import built-in modules defined in node (node_modules). As far as I know, this feature isn't available in import as of now. For instance: we can't import fs module with import. for that, we HAVE to use require, far as I know (at least till Node.js 10, even after that its still at experimental stage).

//Anonymous function
module.exports = (template, product) => {
  //VERY IMPORTANT! Its not a good practice to directly manipulate template HTML rather we replicated the manipulated version to a new variable called <output> from which we carried rest of the manuplations on it
  let output = template.replaceAll('{%PRODUCTNAME%}', product.productName);
  // output = output.replace(/{%IMAGE%}/g, product.image);// IMPORTANT! > global RegExp /.../g flag replaces all matching template placeholders.
  output = output.replaceAll('{%IMAGE%}', product.image);
  output = output.replaceAll('{%PRICE%}', product.price);
  output = output.replaceAll('{%FROM%}', product.from);
  output = output.replaceAll('{%NUTRIENTS%}', product.nutrients);
  output = output.replaceAll('{%QUANTITY%}', product.quantity);
  output = output.replaceAll('{%DESCRIPTION%}', product.description);
  output = output.replaceAll('{%ID%}', product.id);
  //ORGANIC IS A SPECIAL CASE. ITS SPECIFIED BOOLEAN VALUE IN THE JSON FILE WHICH DESIGNATES WHETHER THE ITEM GETS AN ORGANIC BADGE OR NOT VIA CSS CLASS MANIPULATION AS SEEN IN THE TEMPLATE FILES.
  if (!product.organic)
    output = output.replaceAll('{%NOT_ORGANIC%}', 'not-organic');

  return output;
};
