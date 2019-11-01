//cloud project 1: VM Orchestration
`use strict`
async function main(){
const Compute = require('@google-cloud/compute')
const compute = new Compute({
    projectId: 'cpeg673proj1-256900',
    keyFilename: './keyFile.json'
})

const zone = compute.zone('us-east1-b')
var counter = 2;
//incrementing the vm name
function vmName(){
    return `instance-${++counter}`
}
//vm configs
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
                'sourceImage': 'projects/cpeg673proj1-256900/global/images/proj1image',
                'diskType': 'projects/cpeg673proj1-256900/zones/us-east1-b/diskTypes/pd-standard',
                'diskSizeGb': 30
            }
        }
    ],
}
var express = require('express');
const app = express();
const http= require('http');
const{createTerminus} = require(`@godaddy/terminus`)

//health check endpoint
app.get('/health', (req, res) => {
    res.send(`HealthCheck Status: ${res.statusCode} => VIRTUAL MACHINE IS HEALTHY`)
  })
  const server = http.createServer(app)
function onSignal () {
  console.log('server is starting cleanup')
  // start cleanup of resource, like databases or file descriptors
}
async function onHealthCheck () {
  // checks if the system is healthy, like the db connection is live
  // resolves, if health, rejects if not
}
  createTerminus(server, {
    signal: 'SIGINT',
    healthChecks: { '/healthcheck': onHealthCheck },
    onSignal
  })

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

res.write(`YOU HAVE SUCCEEDED! CREATE HTTP REQUEST RECEIVED!\n`)
res.write(`VM ${name} HAS BEEN CREATED\n`)
res.write(`HealthCheck Status: ${res.statusCode}`)
res.end()
console.log()
})

//list vm endpoint
 app.get('/list', async function getVMs(req, res) {
try{
//return new Promise((resolve, reject) => {
         const name = vmName();
         config.disks[0].deviceName = name;
        const vms = await compute.getVMs({maxResults:10})
         console.log(`Found ${vms[0].length} VMs!`)
        //vms.forEach(vms => console.log(vms))
        console.log("Current VMs running:")
        for(let i=0; i<vms[0].length; i++){
             let temp = vms[0][i].metadata.name
             console.log(temp)
}
res.write(`YOU HAVE SUCCEEDED! LIST HTTP REQUEST RECEIVED!\n`)
res.write(`CURRENTLY ${vms[0].length} VMS RUNNING!\n`)
res.write(`HealthCheck Status: ${res.statusCode}`)
res.end()
console.log(" ")
 console.log(`HealthCheck Status: ${res.statusCode}`);
console.log('VMs is healthy');
}
catch(err) {
console.log(err)
}
 });

//delete vm endpoint
 app.get('/delete/:id', async function deleteVMs(req,res){
try{
     const name = vmName();
    config.disks[0].deviceName = name;
    const vm = zone.vm(`instance-${req.params.id}`)
        const [operation] = await vm.delete()
await operation.promise()
 res.write(`YOU HAVE SUCCEEDED! DELETE HTTP REQUEST RECEIVED!\n`)
res.write(`REQUESTED VM HAS BEEN DELETED\n`)
res.write(`HealthCheck Status: ${res.statusCode}`)
res.end()
console.log(`Requested VM has been deleted`)
}
catch(err){
        console.log(err)
}
});
const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Listening on port ${port}...`));

}

main().catch(console.error)
