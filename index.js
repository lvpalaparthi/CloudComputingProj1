//cloud project 1: VM Orchestration
`use strict`
async function main(){
const Compute = require('@google-cloud/compute')
const compute = new Compute({
    projectId: 'cpeg673proj1',
    keyFilename: './keyFile.json'
})
const zone = compute.zone('us-east1-b')
var counter = 2;
// function findName(){
//         vms = getVMs();
//         for(let i=3; i<vms[0].length; i++){
//             let temp = vms[0][i].metadata.name
//             console.log(vm${i+1}:${temp})
//             vm.push(temp)
//         }
//       return vm;
// }
// const name = findName();
// var random = Math.floor(Math.random() * 20) + 1
// //console.log(random)
//  name = `instance-${random}`

function vmName(){
    return `instance-${++counter}`
}
    const name = vmName()


const config = {
    http: true,
    https: true,
    machineType: 'n1-standard-1',
    tags: [
        'http-server',
        'https-server'
    ],
    'disks': [
        {
            'kind': 'compute#attachedDisk',
            'type': 'PERSISTENT',
            'boot': true,
            'mode': 'READ_WRITE',
            'autoDelete': true,
            'deviceName': name,
            'initializeParams': {
                'sourceImage': 'projects/cpeg673proj1/global/images/proj1image',
                'diskType': 'projects/cpeg673proj1/zones/us-east1-b/diskTypes/pd-standard',
                'diskSizeGb': 30
            }
        }
    ],
}
//sample hello world endpoint
var express = require('express'),
         app = express();
app.get('/', (req, res) => {
    res.send('Hello World');
});

//create vm endpoint
app.get('/create', async function makeVMs(req, res){
    const name = vmName()
    config.disks[0].deviceName = name
    await zone.createVM(name, config)

.then(() => {
    console.log('created')
    return zone.vm(name).getMetadata()
})
.then((data) => {
      console.log('get meta')
    const pubIP = data[0].networkInterfaces[0].accessConfigs[0].natIP // Public                                                                                                                                   IP to access VM
    console.log(`Launching VM with ip: ${pubIP}, wait 20 seconds before sshing..                                                                                                                                  .`)
    const setMeta = {
        'ssh-keys':'lvpal: ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDdxtSxsXWSXDIIn                                                                                                                                  AtVE8q7nxpVCvcjfpTkwBUSFZtenGR3y9/tslpyxXhfylH8Vfxl1erQPF8G8TbiM6W4K0vF/8On8jqwb                                                                                                                                  oqx78RxB4TMt2QgenswWGPN8/XCNFDa14y+nsrm9P8/KEVh19SzVG2GNTidKc3rvRdIpnW/vvuRmY7c8                                                                                                                                  TovFX2BpAMTbpHaD9Bw7uggd14I/LJQmnkMliauyW4gKt6vwqmfCC1Z2dntlBO3ydKWwfV7Mky7XBpg4                                                                                                                                  1b23V+rm4rPThVFV9d2HKUHWZev81KS+UEDMQ5kdywiP4FSUyq3MJLRUa52JhpWq4XzB9lhTKpDwI3V8                                                                                                                                  ScIhAM3 lvpal@DESKTOP-LTGGQ89', // Example using my ssh public key
    }
    return zone.vm(name).setMetadata(setMeta) // Set the metadata (put your ssh                                                                                                                                   key in)
})
.then(() => {
    console.log('Launched VM!')
})
.catch((err) => {
    console.log(err)
})
console.log(`VM ${name} created!`)

 res.send(`YOU HAVE SUCCEEDED! CREATE HTTP REQUEST RECEIVED! ${name}`)

})

//list vm endpoint
 app.get('/list', async function getVMs(req, res) {
try{
//return new Promise((resolve, reject) => {
         const name = vmName();
         config.disks[0].deviceName = name;
        const vms = await compute.getVMs({maxResults:10})
         console.log(`Found ${vms[0].length} VMs!`)
        //vms.forEach(vms =>
        //listVMs();
    res.send(`YOU HAVE SUCCEEDED! LIST HTTP REQUEST RECEIVED! ${vms[0].length}`)
}
//.then(() => {
//console.log(`getting VMs`)
//})
catch(err) {
console.log(err)
}
//res.send(`YOU HAVE SUCCEEDED! LIST HTTP REQUEST RECEIVED! ${vms[0].length}`))

 });

//delete vm endpoint
 app.get('/delete/:id', async function deleteVMs(req,res){
try{
     const name = vmName();
    config.disks[0].deviceName = name;
    const vm = zone.vm(`instance-${req.params.id}`)
        const [operation] = await vm.delete()
await operation.promise()
 res.send(`YOU HAVE SUCCEEDED! DELETE HTTP REQUEST RECEIVED!${vm}`)

    //    await operation.promise()
}
//.then(() => {
//    console.log(`VM deleted!`)
//})
catch(err){
        console.log(err)
}
//    res.send(`YOU HAVE SUCCEEDED! DELETE HTTP REQUEST RECEIVED!${vm}`)
});

//load balancer

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

}

main().catch(console.error)

