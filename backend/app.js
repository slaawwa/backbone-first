import 'module-alias/register'

import { createServer } from 'http-server'
import fs from 'fs'
import cnf from '@cnf'
import routes, { setRoutes } from '@back/routes'

const responseFn = (res, result) => {
    if (result !== undefined && result !== res) {
        switch (typeof result) {
            case 'object':
                res.json(result)
                break
            /*case 'string':
                res.end(result)
                break*/
            default:
                res.end(result)
        }
    }
}

const server = createServer({
    root: cnf.folder.dist,

    logFn: (req, res, err) => {
        res._err = err
        if (err && typeof err !== 'function') {
            if (req.url.startsWith('/api/')) {
                res.writeHead(err.status || 404, {
                    'Content-Type': 'application/json'
                })
                res.end(
                    JSON.stringify({
                        success: false,
                        mess: err.toString(),
                        data: err
                    })
                )
            } else {
                res.writeHead(err.status || 404, {
                    'Content-Type': 'text/html'
                })
                res.end(
                    fs.readFileSync(`${cnf.folder.dist}/index.html`, 'utf-8')
                )
            }
        }
    },
    before: [
        // (req, res) => {
        //     res.on('end', function() {
        //         if (req.method === 'GET' && req.url.startsWith('/libs/')) {
        //             console.log('LIBS:::', req.url)
        //             res.writeHead('LIBS');
        //             res.end();
        //         } else {
        //             res.emit('next')
        //         }
        //     });
        //     res.emit('next');
        // },
        // NOTE: Write log
        (req, res) => {
            res.on('end', function() {
                if (!res.notResp) {
                    res.notResp = true
                    const err = res._err,
                        color =
                            res.statusCode === 200
                                ? cnf.color.GREEN
                                : cnf.color.MAGENTA,
                        method = req.method,
                        status = `${res.statusCode}${
                            err && res.statusCode !== 200
                                ? ' ' + err.toString()
                                : ''
                        }`,
                        url = req.url
                    console.log('-->', method, url);
                    // console.log('err -->', err);
                    if (
                        !err &&
                        method === 'GET' &&
                        url.startsWith('/static/')
                    ) {
                        // static files
                        console.log(' -> static:', method, url)
                    } else {
                        console.info(
                            `${color}${method} [${status}]${
                                cnf.color.RESET
                            } ${url}`
                        )
                    }
                }
            })

            res.emit('next')
        },
        (req, res) => {
            if (
                // !err &&
                req.method === 'GET' &&
                req.url.startsWith('/libs/')
            ) {
                // static files
                const FILE = `${cnf.folder.root}${req.url.replace('/libs/', '/node_modules/')}`
                console.log(' -> libs:', req.method, FILE)
                res.end(
                    fs.readFileSync(FILE, 'utf-8')
                )
            } else {
                res.emit('next');
            }
        },
        // NOTE: Routes system
        (req, res) => {
            const route = routes.find((route, index) => {
                return req.url === route.path && req.method === route.method
            })

            if (route) {
                let result = route.handler.call(server, req, res)
                if (result instanceof Promise) {
                    result = result.then(result => responseFn(res, result))
                } else {
                    responseFn(res, result)
                }
            } else {
                res.emit('next')
            }
        }
    ]
})

// route.get('/api/test', function () {
//   this.res.writeHead(200, { 'Content-Type': 'text/plain' })
//   this.res.end('hello world\n');
// });

export { server }

server.listen(cnf.server.port)

if (setRoutes) {
    setRoutes(server)
}

// console.log(' => SERVER run on port:', cnf.server.port)
console.log(
    `Server running on port: ${cnf.color.CYAN}`,
    cnf.server.port,
    cnf.color.RESET
)