const express = require('express')
const path = require('path')
const https = require('https')

const app = new express()
const distDir = '/dist/lightfeather-coding-challenge'
app.use(express.json())

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, `${distDir}/index.html`))
})

app.get('/api/supervisors', async (req, res) => {
    const supervisorsRequest = https.request('https://o3m5qixdng.execute-api.us-east-1.amazonaws.com/api/managers', apiResponse => {
        let supervisorsResponseJsonString = ''
        apiResponse.on('data', chunk => {
            supervisorsResponseJsonString += chunk.toString()
        })
        apiResponse.on('end', () => {
            const supervisors = JSON.parse(supervisorsResponseJsonString)
            let supervisorJurisdictionAndNameStrings = [];
            for (let i = 0; i < supervisors.length; i++) {
                const supervisor = supervisors[i]
                if (isNaN(parseInt(supervisor.jurisdiction))) { // Must be a non-numeric jurisdiction
                    supervisorJurisdictionAndNameStrings.push(`${supervisor.jurisdiction} - ${supervisor.lastName}, ${supervisor.firstName}`)
                }
            }
        
            supervisorJurisdictionAndNameStrings = supervisorJurisdictionAndNameStrings.sort()
        
            res.send(supervisorJurisdictionAndNameStrings); // TODO: Use app_status/app_data/app_message
        })
    })
    supervisorsRequest.on('error', error => {
        console.error(error)
    })

    supervisorsRequest.end()
})

app.post('/api/submit', async (req, res) => {
    const notificationRequest = req.body;

    const validateName = (name) => {
        if (name.match(/[^A-z]/)) {
            return ['Names can only contain letters.'];
        }
        return null;
    }

    let errors = [];
    if (!notificationRequest.firstName) {
        errors.push('A first name is required.');
    }
    else {
        let nameValidationErrors = validateName(notificationRequest.firstName);
        if (nameValidationErrors) {
            errors.push(`First Name validation failed: ${nameValidationErrors.join(', ')}`)
        }
    }

    if (!notificationRequest.lastName) {
        errors.push('A last name is required.');
    }
    else {
        let nameValidationErrors = validateName(notificationRequest.lastName);
        if (nameValidationErrors) {
            errors.push(`Last Name validation failed: ${nameValidationErrors.join(', ')}`)
        }
    }

    if (notificationRequest.phoneNumber &&
        !notificationRequest.phoneNumber.match(/^\d{3}-\d{3}-\d{4}$/)
    ) {
        errors.push(`Phone Number validation failed: Must match the form '###-###-####'.`)
    }

    if (notificationRequest.email &&
        !notificationRequest.email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    ) {
        errors.push(`Email validation failed: Must be a valid email format.`)
    }

    if (!notificationRequest.supervisor) {
        errors.push('A supervisor must be selected.');
    }

    if (errors.length > 0) {
        res.send({
            app_status: 'error',
            app_data: errors,
            app_message: 'Failed to subscribe for notifications.'
        })
        return
    }

    console.log(notificationRequest);

    res.send({
        app_status: 'success',
        app_data: {},
        app_message: 'Successfully subscribed to notifications.'
    })
})

app.get('*', async (req, res) => {
    res.sendFile(path.join(__dirname, `${distDir}/${req.path}`))
})

app.listen(8080, () => {
    console.log('Listening on 8080. Ctrl+c to stop this server.')
})