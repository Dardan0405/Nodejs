const deleteProduct = btn =>{
const prodId= btn.parentNode.querySelector('[name=prductId]').value;
const crsf =btn.parentNode.querySelector('[name=_crsf]').value;

fetch('/admin/product' + prodId,{
    method: 'DELETE',
    headers:{
        'csrf-token': crsf
    }
}).then( result =>{
    return result.json
})
.then(data =>{
    console.log(data);
    productElement.parentNode.removeChild(productElement)
})
.catch(err =>{
    console.log(err)
});
}