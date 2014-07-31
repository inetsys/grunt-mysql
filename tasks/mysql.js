/*
 * grunt-mysql
 * https://github.com/inetsys/grunt-mysql
 *
 * Copyright (c) 2014 Luis Lafuente
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    function run_all(task, args) {
        Object.keys(grunt.config.data[task]).forEach(function(v, k) {
            if (v !== "all" && v !== "options") {
                grunt.task.run([task, v].concat(args).join(":"));
            }
        });
    }

    function exec(cmd, callback) {
        grunt.log.writeln("running: " + cmd);

        require('child_process').exec(cmd, function(error, stdout, stderr) {
            if (error) {
                grunt.log.error(error);
            }

            if (stdout && stdout.length) {
                grunt.verbose.write(stdout);
            }
            if (stdout && stdout.length) {
                grunt.log.error(error);
            }

            callback(error, stdout, stderr);
        });
    }

    function exec_sql(sql, options, callback) {
        var cmd = '/usr/bin/mysql ' + ["-e", "'" + sql + "'"].concat(mysql_args(options)).join(" ");

        exec(cmd, callback);
    }

    function get_options(task_name, target) {
        var default_options = {
            db: {
                host: "127.0.0.1",
                name: "database",
                user: "user",
                password: "password",
                charset: "UTF8"
            }
        };

        var target_options = grunt.config([task_name, target, 'options']) || {};
        var task_options = grunt.config([task_name, 'options']) || {};

        return grunt.util._.merge({}, default_options, task_options, target_options);
    }

    function mysqldump_args(options) {
        return [
            "-u " + options.db.user,
            "-h " + options.db.host,
            "-p" + options.db.password,
            options.db.name
        ];
    }

    function mysql_args(options) {
        return [
          "-u " + options.db.user,
          "-h " +  options.db.host,
          "-D " + options.db.name,
          "-p" + options.db.password
        ];
    }

    grunt.registerMultiTask(
        'mysql-dump',
        'Dump database to a file (.gz)',
        function(file) {
            var options = get_options('mysql-dump', this.target),
                done = this.async(),
                cmd;

            if (this.target === "all") {
                run_all(this.name, [file]);
                return done();
            }

            if (file.indexOf("%s") !== -1) {
                file = require("util").format(file, this.target);
            }

            grunt.log.writeln("Dumping DB to " + file + " ...");
            grunt.verbose.writeln("configuration", options);

            cmd = "/usr/bin/mysqldump " + ["--add-drop-table"].concat(mysqldump_args(options)).join(" ");

            if (/\.gz$/.test(file)) {
                cmd = [cmd, "gzip > " + file].join(" | ");
            } else {
                cmd = cmd + " > " + file;
            }

            exec(cmd, function() {
                done();
            });
        }
    );

    grunt.registerMultiTask(
        'mysql-load',
        'Restore dump',
        function(file) {
            var options = get_options('mysql-load', this.target),
                done = this.async(),
                cmd = "";

            if (this.target === "all") {
                run_all(this.name, [file]);
                return done();
            }

            grunt.log.writeln("Loading DB with " + file + " ...");

            if (/\.tar.gz$/.test(file)) {
                cmd = "tar -xf " + file + ' -O | /usr/bin/mysql ' + mysql_args(options).join(" ");
            } else if (/\.gz$/.test(file)) {
                cmd = "gunzip -c " + file + ' | ' + '/usr/bin/mysql ' + mysql_args(options).join(" ");
            } else {
                cmd = '/usr/bin/mysql ' + mysql_args(options).join(" ") + ' < ' + file;
            }

            exec(cmd, function() {
                done();
            });
        }
    );

    grunt.registerMultiTask(
        'mysql-drop',
        'Drop tables',
        function() {
            var options = get_options('mysql-drop', this.target),
                done = this.async();

            exec_sql("SHOW TABLES;", options, function(error, stdout, stderr) {
                var tables = [];

                stdout.split("\n").forEach(function(e,k) {
                    if (e && k > 0) {
                        tables.push("DROP TABLE " + e + " CASCADE");
                    }
                });

                if (tables[0]) {
                    exec_sql(tables.join("; ")+';', options, function(error, stdout, stderr) {
                        grunt.log.writeln(stdout);
                        if (stderr && stderr.length) {
                            grunt.log.error(stderr);
                        }
                        done();
                    });
                }

            });
        }
    );

}
