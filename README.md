# grunt-mysql

> Basic functionality for managing MySQL

> tasks: mysql-load, mysql-dump, mysql-drop

## Getting Started
This plugin requires [Grunt](http://gruntjs.com/) `0.4.*`, mysql & mysqldump command.

```shell
npm install grunt-mysql --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-mysql');
```

## The "mysql-*" tasks

### Overview
In your project's Gruntfile, add a section named `mysql` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  "mysql-********": {
    options: {
      db: {
        host: "127.0.0.1",
        name: "database",
        user: "user",
        password: "password",
        charset: "UTF8"
      }
    }
  },
});
```

### Options

#### options.db.host
Type: `String`
Default value: `127.0.0.1`

Database host

#### options.db.name
Type: `String`
Default value: `database`

Database name

#### options.db.user
Type: `String`
Default value: `user`

Database user

#### options.db.password
Type: `String`
Default value: `password`

Database password. Notice that will be displayed in console...

#### options.db.charset
Type: `String`
Default value: `charset`

No use atm

### MultiTasks

#### mysql-dump

Dump a database

When target is **all**, loop through all target and run them, _so dump **all** databases_. File must have "%s" that will be replaced by the target name.

```bash
grunt mysql-dump:[target]:dump.tar.gz
grunt mysql-dump:[target]:dump.txt

grunt mysql-dump:all:%s.txt
```

#### mysql-load

Load given dump

When target is **all**, loop through all target and run them -> _load **all** databases_. File must have "%s" that will be replaced by the target name.

```bash
grunt mysql-load:[target]:dump.tar.gz
grunt mysql-load:[target]:dump.txt

grunt mysql-dump:all:%s.txt
```

#### mysql-drop

Drop all tables and dependant objects

When target is **all**, loop through all target and run them -> _drop **all** databases_.

```bash
grunt mysql-mysql:drop:[target]
```
