const csdown = {
    d: [],
    d_: [],
    author: '流苏',
    title: '瓜子影视',
    version: 202606192,
    home: function() {
        let d = this.d,
            d_ = this.d_,
            pg = MY_PAGE;
        if (MY_PAGE == 1) {
            this.isauthor();
            try {
                if (!getItem('up' + this.version, '')) {
                    this.update()
                    setItem('up' + this.version, '1')
                }
            } catch (e) {
                toast('未获取到远程数据，请连接代理后重试')
                log(e.message)
            }
            d_.push({   
                title: "搜索 ",
                url: $.toString(() => {
                    if (input.trim()) {
                        putMyVar('keyword', input);
                        return $('hiker://empty?page=fypage&#gameTheme#').rule(() => {
                            $.require("csdown").search()
                        })
                    }
                    return 'hiker://empty';
                }),
                desc: "请输入搜索关键词",
                col_type: "input",
                extra: {
                    onChange: $.toString(() => {
                        putMyVar('keyword', input)
                    }),
                    defaultValue: getMyVar('keyword', ''),
                }
            })
            let 首页 = [{
                title: '发现&首页&视频&小说&漫画',
                id: '1&2&3&4&5',
                img: 'https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/47.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/175.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/78.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/48.png&https://ghproxy.net/https://raw.githubusercontent.com/ls125781003/tubiao/main/more/109.png'
            }];
            let longclick = [{
                title: '更新日志',
                js: $.toString(() => {
                    $.require("csdown").update()
                })
            }, {
                title: '重新获取远程',
                js: $.toString(() => {
                    return $('是否重新获取远程文件？').confirm(() => {
                        try {
                            let file = fetch('https://ghproxy.net/https://raw.githubusercontent.com/csdown/hiker_yingshi/refs/heads/main/rules/%E7%93%9C%E5%AD%90%E5%BD%B1%E8%A7%86.js');
                            writeFile('hiker://files/rules/csdown/瓜子影视.js', file);
                            refreshPage(false);
                            return 'toast://获取远程文件成功';
                        } catch (e) {
                            log(e.message)
                            return 'toast://获取失败';
                        }
                    })
                })
            }]
            this.Cate(首页, '首页', d_, 'icon_5', longclick);
            d_.push({
                col_type: 'big_blank_block',
            });
            setPreResult(d_)
        }
        let 分类 = getMyVar('首页', '1');
        if (MY_RULE.author == this.author || MY_NAME == '嗅觉浏览器') {
            if (分类 == 1) {
                this.findvideo()
            } else if (分类 == 2) {
                this.cate()
            } else if (分类 == 3) {
                this.microvod()
            } else if (分类 == 4) {
                this.novel()
            } else if (分类 == 5) {
                this.comic()
            }
        } else {
            d.push({
                title: '请勿修改作者名',
                url: 'hiker://empty',
                col_type: 'text_center_1'
            })
        }
        deleteItem("loading_");
        setResult(d)
    },
    color: function(txt) {
        return '<b><font color=' + '#FF6699' + '>' + txt + '</font></b>'
    },
    strong: function(d, c) {
        return '‘‘’’<strong><font color=#' + (c || '000000') + '>' + d + '</font></strong>';
    },
    sha1: function(str) {
        eval(getCryptoJS());
        return CryptoJS.SHA1(str).toString();
    },
    addressTag: function(url, text) {
        return "<a href='" + url + "'>" + text + "</a>";
    },
    top_Cate: function(list, n, d, col, longclick) {
        col = col || 'scroll_button';
        longclick = longclick || [];
        setItem(n + '_index', list[0].id + '');
        let n_ = getMyVar(n, getItem(n + '_index'));
        list.forEach(data => {
            d.push({
                title: (n_ == data.id ? this.strong(data.name, 'FF6699') : data.name),
                img: data.img || '',
                url: $('#noLoading#').lazyRule((n, name, nowid, newid) => {
                    if (newid != nowid) {
                        putMyVar(n, newid);
                        refreshPage(false);
                    }
                    return 'hiker://empty';
                }, n, data.name, n_, data.id + ''),
                col_type: col,
                extra: {
                    longClick: longclick,
                    backgroundColor: n_ == data.id ? "#20FA7298" : "",
                }
            })
        })
        d.push({
            col_type: 'blank_block',
        });
        return d
    },
    Cate: function(list, n, d, col, longclick) {
        col = col || 'scroll_button';
        longclick = longclick || [];
        let index_n = list[0].id.split('&')[0] + '';
        list.forEach(data => {
            let title = data.title.split('&');
            let id = data.id.split('&');
            let img = data.img != null ? data.img.split('&') : [];
            let n_ = getMyVar(n, index_n);
            title.forEach((title, index) => {
                d.push({
                    title: (n_ == id[index] ? (col == 'icon_small_3' ? this.color(title) : this.strong(title, 'FF6699')) : title),
                    img: img[index],
                    url: $('#noLoading#').lazyRule((n, title, nowid, newid) => {
                        if (newid != nowid) {
                            putMyVar(n, newid);
                            refreshPage(false);
                        }
                        return 'hiker://empty';
                    }, n, title, n_, id[index] + ''),
                    col_type: col,
                    extra: {
                        longClick: longclick,
                        backgroundColor: n_ == id[index] ? "#20FA7298" : "",
                    }
                })
            })
            d.push({
                col_type: 'blank_block',
            });
        })
        return d;
    },
    Decrypt: function(word, key_, iv_) {
        eval(getCryptoJS())
        const key = CryptoJS.enc.Utf8.parse(key_);
        const iv = CryptoJS.enc.Utf8.parse(iv_);
        let encryptedHexStr = CryptoJS.enc.Base64.parse(word);
        let decrypt = CryptoJS.AES.decrypt({
            ciphertext: encryptedHexStr
        }, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr;
    },
    Decrypt_Hex_: function(word, key_, iv_) {
        eval(getCryptoJS())
        const key = CryptoJS.enc.Utf8.parse(key_);
        const iv = CryptoJS.enc.Utf8.parse(iv_);
        let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
        let decrypt = CryptoJS.AES.decrypt({
            ciphertext: encryptedHexStr
        }, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr;
    },
    // 加密函数
    Encrypt_: function(plaintext, key_, iv_) {
        eval(getCryptoJS())
        const key = CryptoJS.enc.Utf8.parse(key_);
        const iv = CryptoJS.enc.Utf8.parse(iv_);
        let encrypted = CryptoJS.AES.encrypt(plaintext, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        let ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase();
        return ciphertext;
    },
    Decrypt_Hex(data, key, iv) {
        const Cipher = javax.crypto.Cipher;
        const SecretKeySpec = javax.crypto.spec.SecretKeySpec;
        const IvParameterSpec = javax.crypto.spec.IvParameterSpec;
        const JString = java.lang.String;
        const JArray = java.lang.reflect.Array;
        const JByte = java.lang.Byte;
        try {
            const mode = "AES/CBC/PKCS7Padding";
            const algorithm = mode.split("/")[0];
            // 1. 处理Hex密文字符串，去除空格转byte[]
            let hexStr = new JString(data).replaceAll("\\s+", "");
            let encryptedBytes;
            try {
                // Android高版本原生HexFormat
                encryptedBytes = java.util.HexFormat.of().parseHex(hexStr);
            } catch (e) {
                // 低版本兼容手动转Hex
                let hexLen = hexStr.length();
                let byteCount = hexLen / 2;
                encryptedBytes = JArray.newInstance(JByte.TYPE, byteCount);
                let idx = 0;
                for (let i = 0; i < hexLen; i += 2) {
                    let sub = hexStr.substring(i, i + 2);
                    let num = java.lang.Integer.parseInt(sub, 16);
                    encryptedBytes[idx++] = ((num & 0xff) << 24) >> 24;
                }
            }
            // 2. 密钥、IV UTF8转字节（和CryptoJS Utf8.parse一致）
            let keyBytes = new JString(key).getBytes("UTF-8");
            let ivBytes = new JString(iv).getBytes("UTF-8");
            // 3. 初始化密钥与IV向量
            let secretKey = new SecretKeySpec(keyBytes, algorithm);
            let ivSpec = new IvParameterSpec(ivBytes);
            // 4. 创建Cipher并初始化解密模式 2=DECRYPT_MODE
            let cipher = Cipher.getInstance(mode);
            cipher.init(2, secretKey, ivSpec);
            // 5. 解密转UTF8字符串返回
            let plainBytes = cipher.doFinal(encryptedBytes);
            return new JString(plainBytes, "UTF-8");
        } catch (e) {
            log("Decrypt_Hex解密失败: " + e.toString());
            return null;
        }
    },
    Encrypt(plaintext, key, iv) {
        const Cipher = javax.crypto.Cipher;
        const SecretKeySpec = javax.crypto.spec.SecretKeySpec;
        const IvParameterSpec = javax.crypto.spec.IvParameterSpec;
        const JString = java.lang.String;
        const JArray = java.lang.reflect.Array;
        const JByte = java.lang.Byte;
        try {
            const transform = "AES/CBC/PKCS7Padding";
            const alg = transform.split("/")[0];
            // 明文转UTF8字节
            let plainBytes = new JString(plaintext).getBytes("UTF-8");
            // key、iv UTF8转字节，和CryptoJS Utf8.parse行为一致
            let keyBytes = new JString(key).getBytes("UTF-8");
            let ivBytes = new JString(iv || key).getBytes("UTF-8");
            let secretKey = new SecretKeySpec(keyBytes, alg);
            let ivSpec = new IvParameterSpec(ivBytes);
            // 初始化加密模式 1 = ENCRYPT_MODE
            let cipher = Cipher.getInstance(transform);
            cipher.init(1, secretKey, ivSpec);
            // 加密得到密文字节数组
            let cipherBytes = cipher.doFinal(plainBytes);
            // 转大写Hex字符串，增加低版本兼容逻辑
            let hexStr;
            try {
                // 高版本Android使用HexFormat
                hexStr = java.util.HexFormat.of().withUpperCase().formatHex(cipherBytes);
            } catch (e) {
                // 低版本无HexFormat，手动字节转大写Hex
                let len = JArray.getLength(cipherBytes);
                let sb = new java.lang.StringBuilder();
                for (let i = 0; i < len; i++) {
                    let b = cipherBytes[i];
                    // 转无符号8位整数
                    let val = b & 0xFF;
                    // 补零两位大写十六进制
                    let hex = java.lang.Integer.toHexString(val).toUpperCase();
                    if (hex.length() === 1) {
                        sb.append("0");
                    }
                    sb.append(hex);
                }
                hexStr = sb.toString();
            }
            return hexStr;
        } catch (e) {
            log("Encrypt加密失败: " + e);
            return null;
        }
    },
    rsa_en: function(data) {
        let rsakey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDUM5+/y8sPsWkd1/RQS64X259EUwxFXFE5HlA65MqrxnPs0JqoSRojSDy5QhwvROlaD6TwRQHKMY2OAZ6SnQeUJsChTEFIR9qUkwrs3/MVUMxjsv6JS6Oe/juclyJGTgVmDhB55EafXsD0SQYVj/QXXsxR6ewR5E2kL52yAAD4yQIDAQAB";
        let options = {
            config: "RSA/ECB/PKCS1Padding",
            type: 1,
            long: 2,
            block: true
        }
        let data_en = rsaEncrypt(data, rsakey, options);
        return data_en;
    },
    rsa_de: function(data) {
        let rsakey = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGAe6hKrWLi1zQmjTT1ozbE4QdFeJGNxubxld6GrFGximxfMsMB6BpJhpcTouAqywAFppiKetUBBbXwYsYU1wNr648XVmPmCMCy4rY8vdliFnbMUj086DU6Z+/oXBdWU3/b1G0DN3E9wULRSwcKZT3wj/cCI1vsCm3gj2R5SqkA9Y0CAwEAAQKBgAJH+4CxV0/zBVcLiBCHvSANm0l7HetybTh/j2p0Y1sTXro4ALwAaCTUeqdBjWiLSo9lNwDHFyq8zX90+gNxa7c5EqcWV9FmlVXr8VhfBzcZo1nXeNdXFT7tQ2yah/odtdcx+vRMSGJd1t/5k5bDd9wAvYdIDblMAg+wiKKZ5KcdAkEA1cCakEN4NexkF5tHPRrR6XOY/XHfkqXxEhMqmNbB9U34saTJnLWIHC8IXys6Qmzz30TtzCjuOqKRRy+FMM4TdwJBAJQZFPjsGC+RqcG5UvVMiMPhnwe/bXEehShK86yJK/g/UiKrO87h3aEu5gcJqBygTq3BBBoH2md3pr/W+hUMWBsCQQChfhTIrdDinKi6lRxrdBnn0Ohjg2cwuqK5zzU9p/N+S9x7Ck8wUI53DKm8jUJE8WAG7WLj/oCOWEh+ic6NIwTdAkEAj0X8nhx6AXsgCYRql1klbqtVmL8+95KZK7PnLWG/IfjQUy3pPGoSaZ7fdquG8bq8oyf5+dzjE/oTXcByS+6XRQJAP/5ciy1bL3NhUhsaOVy55MHXnPjdcTX0FaLi+ybXZIfIQ2P4rb19mVq1feMbCXhz+L1rG8oat5lYKfpe8k83ZA==";
        let options = {
            config: "RSA/ECB/PKCS1Padding",
            type: 1,
            long: 1,
            block: true
        }
        let data_de = rsaDecrypt(data, rsakey, options);
        return JSON.parse(data_de);
    },
    post: function(url, request_key) {
        let t = Math.floor(Date.now() / 1000) + '';
        let token = getItem('token', '') || '';
        let keys = this.rsa_en(JSON.stringify({
            "iv": "rCMNwZASNBKZ8mXV",
            "key": "OITxa5OqAYjhswxx"
        }));
        request_key = this.Encrypt(request_key || '{}', 'OITxa5OqAYjhswxx', 'rCMNwZASNBKZ8mXV');
        let signature = md5('token_id=,token=' + token + ',phone_type=1,request_key=' + request_key + ',app_id=1,time=' + t + ',keys=' + keys + '*&zvdvdvddbfikkkumtmdwqppp?|4Y!s!2br');
        let body = 'token=' + token + '&token_id=&phone_type=1&time=' + t + '&phone_model=xiaomi-25031&keys=' + keys + '&request_key=' + request_key + '&signature=' + signature.toUpperCase() + '&app_id=1&ad_version=1';
        let html = JSON.parse(fetch(getItem('host') + url, {
            headers: {
                'User-Agent': 'Lavf/57.83.100',
                'code': 'GZ0369',
                'deviceId': getItem('deviceId'),
                'lang': 'zh_cn',
                'Cache-Control': 'no-cache',
                'Version': '2604028',
                'PackageName': 'com.ae06aebdbb.y286327f5a.ofe849883320260517',
                'Ver': '3.0.3.2',
                'api-ver': '3.0.3.2',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body,
            method: 'POST',
        })).data;
        let keys_ = this.rsa_de(html.keys);
        let response_key_ = this.Decrypt_Hex(html.response_key, keys_.key, keys_.iv);
        return JSON.parse(response_key_);
    },
    setDesc: function(d, desc, num) {
        //log(desc)
        if (desc == undefined) {
            return;
        }
        desc = desc.constructor == Array ? desc.join('<br>') : desc;
        if (desc.replace(/(<br>|\s+|<\/?p>|&nbsp;)/g, '').length == 0) {
            return;
        }
        const mark = 'desc';
        num = typeof(num) == 'undefined' ? 45 : num
        desc = desc.startsWith('　　') ? desc : '　　' + desc;
        desc = desc.replace(/'/g, "&#39;");
        desc = desc.replace(/\r\n/g, "<br>");
        desc = desc.replace(/\r/g, "<br>");
        desc = desc.replace(/\n/g, "<br>").replace(/[<p>|</p>]/g, "").replace(/br/g, "<br>");

        function substr(str, maxLength) {
            let len = 0;
            for (let i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 255) {
                    len += 2;
                } else {
                    len++;
                }
                if (len > maxLength) {
                    return str.slice(0, i) + '...';
                }
            }
            return str;
        }
        let sdesc = substr(desc, num);
        var colors = {
            show: "black",
            hide: "grey"
        }
        var lazy = $(`#noLoading#`).b64().lazyRule((dc, sdc, m, cs) => {
            var show = storage0.getItem(m, '0');
            var title = findItem('desc').title;
            var re = /(<\/small><br>.*?>).+/g;
            var exp = '展开:';
            var ret = '收起:';
            if (show == '1') {
                updateItem('desc', {
                    title: title
                        .replace(ret, exp)
                        .replace(re, '$1' + sdc + '</small>')
                        .replace(/(<\/small><br>\<font color=").*?(">)/, '$1' + cs.hide + '$2')
                })
                storage0.setItem(m, '0');
            } else {
                updateItem('desc', {
                    title: title
                        .replace(exp, ret)
                        .replace(re, '$1' + dc + '</small>')
                        .replace(/(<\/small><br>\<font color=").*?(">)/, '$1' + cs.show + '$2')
                })
                storage0.setItem(m, '1');
            }
            return `hiker://empty`
        }, desc, sdesc, mark, colors)
        var sc = storage0.getItem(mark, '0') == '0' ? '展开:' : '收起:';
        var dc = storage0.getItem(mark, '0') == '0' ? sdesc : desc;
        var cs = storage0.getItem(mark, '0') == '0' ? colors.hide : colors.show;
        d.push({
            title: '' + '<b><font color="#098AC1">∷剧情简介	</font></b>' + "<small><a style='text-decoration: none;' href='" + lazy + "'>" + sc + '</a></small><br><font color="' + cs + '">' + `${dc}` + '</small>',
            col_type: 'rich_text',
            extra: {
                id: 'desc',
                lineSpacing: 6,
                textSize: 15,
                lineVisible: true,
            }
        })
    },
    banner: function(title, start, arr, data, cfg) {
        let id = title + 'lunbo';
        var rnum = Math.floor(Math.random() * data.length);
        var item = data[rnum];
        putMyVar('rnum', rnum);
        let time = 5000;
        let col_type = 'pic_1_card';
        let color = "white";
        let desc = '';
        if (cfg != undefined) {
            time = cfg.time ? cfg.time : time;
            col_type = cfg.col_type ? cfg.col_type : col_type;
            desc = cfg.desc ? cfg.desc : desc;
        }

        arr.push({
            col_type: col_type,
            img: item.vod_pic,
            desc: desc,
            title: item.vod_name,
            url: $('hiker://empty?#immersiveTheme#').rule(() => {
                $.require("csdown").videoerji()
            }),
            extra: {
                id: id + 'bar',
                vod_id: item.vod_id,
                vod_name: item.vod_name,
            }
        })

        if (start == false || getMyVar('benstart', 'true') == 'false') {
            unRegisterTask(id)
            return
        }

        //log(data)

        let obj = {
            data: data,
        };

        registerTask(id, time, $.toString((obj, id, MY_PARAMS) => {
            var data = obj.data;
            var rum = getMyVar('rnum');

            var i = Number(getMyVar('banneri', '0'));
            if (rum != '') {
                i = Number(rum) + 1
                clearMyVar('rnum')
            } else {
                i = i + 1;
            }
            //log(i)
            //log(data.length)

            if (i > data.length - 1) {
                i = 0
            }
            var item = data[i];
            //log(item)
            try {
                updateItem(id + 'bar', {
                    title: item.vod_name,
                    img: item.vod_pic,
                    url: $('hiker://empty?#immersiveTheme#').rule(() => {
                        $.require("csdown").videoerji()
                    }),
                    extra: {
                        //name: item.title.replace(/<[^>]+>/g, ''),
                        //sname: item.extra.sname,
                        //stype: item.extra.stype,
                        //surl: item.url,
                        //img:item.img,
                        //title: item.title.replace(/<[^>]+>/g, ''),
                        vod_id: item.vod_id,
                        vod_name: item.vod_name,

                    }
                })
            } catch (e) {
                log(e.message)
                unRegisterTask(id)
            }
            putMyVar('banneri', i);

        }, obj, id, MY_PARAMS))
    },
    update: function() {
        const hikerPop = $.require("http://123.56.105.145/weisyr/js/hikerPop.js");
        let pop = hikerPop.updateRecordsBottom([{
            title: "声明",
            records: [
                "““声明””：本小程序完全免费,别被骗了",
                "““声明””：随时可能跑路",
                "““声明””：不要相信里面的广告",
                "““声明””：本小程序作者为““" + this.author + "””",
            ]
        }, {
            title: "2026/06/19",
            records: [
                "‘‘优化’’：优化解密逻辑函数，优化加载速度",
            ]
        }, {
            title: "2026/05/17",
            records: [
                "““修复””：修复视频二级解析，目前仅1080p清晰度可用",
                "““新增””：长按图标重新拉取远程文件",
                "‘‘优化’’：优化部分页面，优化代码",
            ]
        }, {
            title: "2026/01/07",
            records: [
                "‘‘优化’’：优化token获取逻辑，需重生后实现",
                "‘‘优化’’：优化部分代码",
            ]
        }, {
            title: "2025/11/23",
            records: [
                "““修复””：修复视频分类(需要重生)",
            ]
        }, {
            title: "2025/10/08",
            records: [
                "““更新””：主页增加漫画和小说",
                "““更新””：搜索增加漫画和小说",
                "““优化””：优化部分页面",
            ]
        }, {
            title: "2025/09/01",
            records: [
                "““优化””：优化部分页面闪屏问题",
                "““更新””：排序长按增加解析模式",
            ]
        }, {
            title: "2025/08/31",
            records: [
                "““更新””：优化搜索",
            ]
        }, {
            title: "2025/08/30",
            records: [
                "““更新””：优化页面",
            ]
        }, ]);
    },
    findvideo: function() {
        let d = this.d,
            d_ = this.d_,
            pg = MY_PAGE;
        try {
            if (MY_PAGE == 1) {
                if (!storage0.getMyVar('NewDiscover')) {
                    d_.push({
                        col_type: 'blank_block',
                        extra: {
                            id: 'blank_1',
                        }
                    }, {
                        img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                        url: "hiker://empty",
                        col_type: "pic_1_full",
                        extra: {
                            id: "loading_"
                        }
                    });
                    setPreResult(d_)
                }
                this.host_url()
                d.push({
                    title: '““每日更新””',
                    img: 'https://hongniu.ewytek.com/i/2025/08/29/1000069041.png',
                    url: $('hiker://empty?page=fypage&#gameTheme#').rule(() => {
                        $.require("csdown").latestvideo();
                    }),
                    col_type: 'icon_1_left_pic',
                    extra: {
                        lineVisible: false
                    }
                })
                if (!storage0.getMyVar('NewDiscover')) {
                    let NewDiscover = this.post('/App/NewDiscover/getIndex');
                    storage0.putMyVar('NewDiscover', NewDiscover);
                }
                let NewDiscover = storage0.getMyVar('NewDiscover');
                let section = NewDiscover.section;
                let rank = NewDiscover.rank;
                section.forEach(item => {
                    d.push({
                        title: '‘‘' + item.name + '’’',
                        url: 'hiker://empty',
                        col_type: 'text_center_1',
                        extra: {
                            lineVisible: false,
                        },
                    });
                    let section_list = item.list;
                    section_list.forEach(item_1 => {
                        d.push({
                            title: this.color(item_1.name),
                            //img:item_1.pic,
                            img: 'hiker://images/icon_right5',
                            url: $('hiker://empty?page=fypage&#gameTheme#').rule(() => {
                                $.require("csdown").recommend()
                            }),
                            col_type: 'text_icon',
                            extra: {
                                lineVisible: false,
                                cate_id: item_1.cate_id,
                            }
                        })
                        item_1.list_vod.forEach(data => {
                            d.push({
                                title: data.name,
                                img: data.vod_pic,
                                url: $('hiker://empty?#immersiveTheme#').rule(() => {
                                    $.require("csdown").videoerji()
                                }),
                                col_type: 'movie_3',
                                extra: {
                                    vod_id: data.vod_id,
                                    t_id: data.t_id,
                                    vod_name: data.name,
                                }
                            })
                        })
                    })
                })
                rank.forEach(item => {
                    d.push({
                        title: '‘‘' + item.name + '’’',
                        url: 'hiker://empty',
                        col_type: 'text_center_1',
                        extra: {
                            lineVisible: false,
                        },
                    });
                    let rank_list = item.list;
                    rank_list.forEach(item_1 => {
                        d.push({
                            title: this.color(item_1.name),
                            //img:item_1.pic,
                            img: 'hiker://images/icon_right5',
                            url: $('hiker://empty?page=fypage&#gameTheme#').rule(() => {
                                $.require("csdown").recommend()
                            }),
                            col_type: 'text_icon',
                            extra: {
                                lineVisible: false,
                                cate_id: item_1.cate_id,
                            }
                        })
                        item_1.list_vod.forEach(data => {
                            d.push({
                                title: data.name,
                                img: data.vod_pic,
                                url: $('hiker://empty?#immersiveTheme#').rule(() => {
                                    $.require("csdown").videoerji()
                                }),
                                col_type: 'movie_3',
                                extra: {
                                    vod_id: data.vod_id,
                                    t_id: data.t_id,
                                    vod_name: data.name,
                                }
                            })
                        })
                    })
                })
            }
        } catch (e) {
            log(e.message)
        }
    },
    host_url: function() {
        if (getMyVar('a', '') == '') {
            /*
            let api_url_list = JSON.parse(fetch('https://api.5h5hbfhh.com/gz/initialize/getApiUrlList?parameter=key', {
                headers: {
                    'client-version': '3.0.3.2',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'parameter=',
                method: 'POST',
            }));
            let api_list = JSON.parse(this.Decrypt(api_url_list.data, 'KANGEQIU@8868!~.', '0200010900030207'));
            */
            let api_list = [
                'https://api.36kzbh85.com',
                'https://api.5udaneqy.com',
                'https://api.cpcsfgyp.com',
                'https://api.5h5hbfhh.com',
                'https://api.tkfupxqu.com',
                'https://api.qchyzkww.com',
                'https://api.w32z7vtd.com',
                'https://api.yajfv2ph.com',
                'https://api.txxhuc.com',
                'https://api.cpcsfgyp.com',
                'https://api.moe3dze.com',
                'https://api.36kzbh85.com'
            ];
            for (let item of api_list) {
                let host = item;
                let data = fetch(host + '/domain/check');
                if (data == 'success') {
                    setItem('host', host);
                    log(host)
                    putMyVar('a', '1');
                    break;
                }
            }
        }
        if (!getItem('token', '')) {
            let random = 864150060000000 + Math.floor(Math.random() * 10000) + '';
            setItem('deviceId', random);
            if (!getItem('ran', '')) {
                let ran = this.generateRandomHex(40).toUpperCase();
                setItem('ran', ran);
            }
            let request_key, token;
            if (!getItem('signup', '')) {
                request_key = JSON.stringify({
                    "new_key": getItem('ran'),
                    "old_key": "aLFBMWpxBrIDAD1Si/KVvm41",
                    "phone_type": 1,
                    "code": ''
                });
                token = this.post('/App/Authentication/Device/signUp', request_key);
                setItem('signup', '1')
            } else {
                request_key = JSON.stringify({
                    "new_key": getItem('ran'),
                    "old_key": "aLFBMWpxBrIDAD1Si/KVvm41",
                });
                token = this.post('/App/Authentication/Device/signIn', request_key);
            }
            log(token)
            setItem('token', token.token);
            setItem('token_id', token.app_user_id);
            putMyVar('token_refresh', '1')
        }
        if (!getMyVar('token_refresh', '')) {
            let token_refresh = this.post('/App/Authentication/Authenticator/refresh');
            log(token_refresh);
            setItem('token', token_refresh.token);
            setItem('token_id', token_refresh.app_user_id);
            putMyVar('token_refresh', '1')
        }
    },
    generateRandomHex: function(length) {
        var result = '';
        var characters = '0123456789abcdef';
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    },
    latestvideo: function() {
        let d = this.d,
            d_ = this.d_,
            pg = MY_PAGE;
        if (MY_PAGE == 1) {
            d_.push({
                title: '',
                url: 'hiker://empty',
                col_type: 'rich_text',
            })
            d_.push({
                img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                url: "hiker://empty",
                col_type: "pic_1_full",
                extra: {
                    id: "loading_"
                }
            });
            setPreResult(d_)
        }
        let latestvideo_body = JSON.stringify({
            "pageSize": "30",
            "page": pg + ''
        });
        let latestvideo_list = this.post('/App/Index/latestVideo', latestvideo_body);
        latestvideo_list.forEach(data => {
            d.push({
                title: data.vod_name,
                desc: '今日正在更新：““' + data.vod_continu + '””  \n评分：““' + data.vod_scroe + '”” \n更新状态：““' + (data.is_end == true ? '已完结' : '未完结') + '””',
                img: data.vod_pic,
                url: $('hiker://empty?#immersiveTheme#').rule(() => {
                    $.require("csdown").videoerji();
                }),
                col_type: 'movie_1_vertical_pic',
                extra: {
                    vod_id: data.vod_id,
                    vod_name: data.vod_name,
                    lineVisible: false
                }
            })
        })
        deleteItem("loading_");
        setResult(d)
    },
    recommend: function() {
        var d = [];
        var d_ = this.d_;
        let id = MY_PARAMS.cate_id;
        let pg = MY_PAGE;
        if (MY_PAGE == 1) {
            d_.push({
                title: '',
                url: 'hiker://empty',
                col_type: 'rich_text',
            })
            d_.push({
                img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                url: "hiker://empty",
                col_type: "pic_1_full",
                extra: {
                    id: "loading_"
                }
            });
            setPreResult(d_)
        }
        try {
            let body = JSON.stringify({
                "cateId": id,
                "pageSize": "20",
                "page": pg + ''
            });
            let recommend = this.post('/App/NewDiscover/getList', body);
            if (MY_PAGE == 1) {
                d.push({
                    title: recommend.name,
                    desc: '查看更多+',
                    img: 'https://hongniu.ewytek.com/i/2025/08/29/1000069041.png',
                    url: $('hiker://empty?page=fypage&#gameTheme#').rule(() => {
                        $.require("csdown").subcatelist()
                    }),
                    col_type: 'avatar',
                    extra: {
                        cate_id: recommend.cate_id,
                        cate_name: recommend.name,
                    }
                })
            }
            recommend.list.forEach(data => {
                d.push({
                    title: data.title + '\n' + ('‘‘’’评分：' + data.score).small(),
                    desc: data.sub_title + '\n' + (/\.m3u8|\.mp4/.test(data.pre_video) ? '‘‘’’' + this.addressTag($('#noLoading#').b64().lazyRule((pre_video) => {
                        return pre_video + ';{User-Agent@Lavf/57.83.100}';
                    }, data.pre_video), '点击查看预览视频') : ''),
                    img: data.pic,
                    url: $('hiker://empty?#immersiveTheme#').rule(() => {
                        $.require("csdown").videoerji()
                    }),
                    col_type: 'movie_1_vertical_pic',
                    extra: {
                        vod_id: data.vod_id,
                        vod_name: data.title,
                        lineVisible: false
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
        deleteItem("loading_");
        setResult(d)
    },
    subcatelist: function() {
        var d = this.d;
        var d_ = this.d_;
        let pg = MY_PAGE;
        let id = MY_PARAMS.cate_id;
        let name = MY_PARAMS.cate_name;
        if (MY_PAGE == 1) {
            d_.push({
                title: '',
                url: 'hiker://empty',
                col_type: 'rich_text',
            })
            d_.push({
                img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                url: "hiker://empty",
                col_type: "pic_1_full",
                extra: {
                    id: "loading_"
                }
            });
            setPreResult(d_)
            d.push({
                title: name,
                img: 'https://hongniu.ewytek.com/i/2025/08/29/1000069041.png',
                url: 'hiker://empty',
                col_type: 'avatar',
                extra: {}
            })
        }
        try {
            let body = JSON.stringify({
                "cateId": id,
                "pageSize": "30",
                "page": pg + ''
            });
            let subcatelist = this.post('/App/NewDiscover/getSubCateList', body).list;
            subcatelist.forEach(data => {
                d.push({
                    title: data.name,
                    url: $('hiker://empty?page=fypage&#gameTheme#').rule(() => {
                        $.require("csdown").subvodlist()
                    }),
                    col_type: 'text_2',
                    extra: {
                        cate_id: data.cate_id,
                        cate_name: data.name,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
        deleteItem("loading_");
        setResult(d)
    },
    subvodlist: function() {
        let d = this.d,
            d_ = this.d_,
            pg = MY_PAGE;
        let id = MY_PARAMS.cate_id;
        let name = MY_PARAMS.cate_name;
        if (MY_PAGE == 1) {
            d_.push({
                title: '',
                url: 'hiker://empty',
                col_type: 'rich_text',
            })
            d_.push({
                img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                url: "hiker://empty",
                col_type: "pic_1_full",
                extra: {
                    id: "loading_"
                }
            });
            setPreResult(d_)
            d.push({
                title: '‘‘' + name + '’’',
                url: 'hiker://empty',
                col_type: 'text_center_1',
                extra: {
                    lineVisible: false,
                }
            })
        }
        try {
            let body = JSON.stringify({
                "cateId": id,
                "pageSize": "30",
                "page": pg + ''
            });
            let subvodlist = this.post('/App/NewDiscover/getSubVodList', body).list;
            subvodlist.forEach(data => {
                d.push({
                    title: data.vod_name,
                    desc: data.vod_score + ' ' + data.total,
                    img: data.vod_pic,
                    url: $('hiker://empty?#immersiveTheme#').rule(() => {
                        $.require("csdown").videoerji()
                    }),
                    col_type: 'movie_3',
                    extra: {
                        vod_id: data.vod_id,
                        vod_name: data.vod_name,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
        deleteItem("loading_");
        setResult(d)
    },
    videoerji: function() {
        var d = this.d;
        addListener('onClose', $.toString(() => {
            clearMyVar('playinfo');
            clearMyVar('Vurl')
        }));
        let id = MY_PARAMS.vod_id;
        setPageTitle(MY_PARAMS.vod_name);
        try {
            if (!storage0.getMyVar('playinfo', '')) {
                let t = Math.floor(Date.now() / 1000) + '';
                let request_key = JSON.stringify({
                    "token_id": getItem('token_id'),
                    "vod_id": id,
                    "mobile_time": t,
                    "token": getItem('token')
                })
                let playinfo = this.post('/App/IndexPlay/playInfo', request_key);
                storage0.putMyVar('playinfo', playinfo);
            }
            if (!storage0.getMyVar('Vurl')) {
                let request_key = JSON.stringify({
                    "vurl_cloud_id": "2",
                    "vod_d_id": id
                });
                let Vurl = this.post('/App/Resource/Vurl/show', request_key).list;
                storage0.putMyVar('Vurl', Vurl);
            }
            let playinfo = storage0.getMyVar('playinfo');
            let vod = playinfo.vodInfo;
            setPageTitle(vod.vod_name);
            d.push({
                title: vod.vod_name + '\n' + ('‘‘’’演员：' + vod.vod_actor + '\n国家：' + vod.vod_area).small(),
                desc: '类型：' + vod.videoTag.join(' ') + '\n' + ('‘‘’’更新状态：' + vod.new_continue + '  ' + (vod.vod_year.includes('1970') ? '' : vod.vod_year)),
                img: vod.vod_pic,
                url: $('hiker://empty?#gameTheme#').rule((pic, name, actor, videoTag, new_continue, area, vod_use_content, year) => {
                    var d = []
                    d.push({
                        img: pic,
                        url: pic + '#.jpg#',
                        col_type: 'pic_1_full'
                    }, {
                        title: '影片名：' + name,
                        col_type: 'rich_text'
                    }, {
                        title: '年代：' + year,
                        col_type: 'rich_text'
                    }, {
                        title: '演员：' + actor,
                        col_type: 'rich_text'
                    }, {
                        title: '类型：' + videoTag,
                        col_type: 'rich_text',
                    }, {
                        title: '更新状态：' + new_continue,
                        col_type: 'rich_text',
                    }, {
                        title: '国家：' + area,
                        col_type: 'rich_text',
                    }, {
                        title: '简介：' + vod_use_content,
                        col_type: 'rich_text',
                    }, )
                    setResult(d)
                }, vod.vod_pic, vod.vod_name, vod.vod_actor, vod.videoTag.join(' '), vod.new_continue, vod.vod_area, vod.vod_use_content, vod.vod_year),
                col_type: 'movie_1_vertical_pic_blur',
                extra: {
                    gradient: true
                }
            })
            this.setDesc(d, vod.vod_use_content);
            d.push({
                title: (getMyVar('shsort', '0') == '1') ? '““””<b><span style="color: #FF0000">逆序</span></b>' : '““””<b><span style="color: #1aad19">正序</span></b>',
                url: $('#noLoading#').lazyRule(() => {
                    return $.require("csdown").shsort();
                }),
                col_type: 'text_center_1',
                extra: {
                    id: '排序',
                    longClick: [{
                        title: '选择解析模式：' + ['1080p', '1080p 720p', '1080p 720p 480p'][+getItem('jiexi_mode', '0')],
                        js: $.toString(() => {
                            let options = ['1080p', '1080p 720p', '1080p 720p 480p'];
                            let Line = {
                                title: '切换解析模式',
                                options: options,
                                col: 1,
                                selectedIndex: getItem('jiexi_mode', '0'),
                                js: $.toString((options) => {
                                    let mode = options.indexOf(input) + '';
                                    setItem('jiexi_mode', mode);
                                    toast('已切换解析模式');
                                    refreshPage(false);
                                    return 'hiker://empty';
                                }, options)
                            }
                            return 'select://' + JSON.stringify(Line);
                        })
                    }, {
                        title: '当前样式：' + getItem('pic_col_type', 'text_2'),
                        js: $.toString(() => {
                            //let options = ['text_1', 'text_2', 'text_3', 'text_4', 'text_center_1', 'avatar', 'text_icon', 'icon_1_left_pic'];
                            //log(getColTypes())
                            let options = getColTypes();
                            let Line = {
                                title: '切换样式',
                                options: options,
                                selectedIndex: options.indexOf(getItem('pic_col_type', 'text_2')),
                                col: 2,
                                js: $.toString((options) => {
                                    setItem('pic_col_type', input);
                                    refreshPage(false);
                                    toast('样式切换为：' + input);
                                }, options)
                            }
                            return 'select://' + JSON.stringify(Line);
                        })
                    }],
                    lineVisible: false,
                }
            })
            try {
                let urls = storage0.getMyVar('Vurl');
                if (getMyVar('shsort', '0') == '1') {
                    urls.reverse()
                }
                if (urls && urls.length == 0) {
                    d.push({
                        title: '影片下架或未上传，请选择其他影片观看',
                        url: 'hiker://empty',
                        col_type: 'text_center_1',
                        extra: {
                            lineVisible: false
                        }
                    })
                }
                let col = urls.length < 3 || urls[0].title.length > 5 ? 'text_2' : 'text_4';
                urls.forEach(data => {
                    d.push({
                        title: data.title,
                        url: $().lazyRule((id, vurl_id) => {
                            return $.require("csdown").jiexi(id, vurl_id)
                        }, id, data.id),
                        col_type: getItem('pic_col_type', col),
                        extra: {
                            cls: '选集_',
                            id: 'guaziys_' + data.id,
                        }
                    })
                })
            } catch (e) {
                log(e.message)
            }
            d.push({
                col_type: 'blank_block',
                extra: {
                    id: 'blank',
                }
            }, {
                title: '<b><span style="color: #ff847c">推荐</span></b>',
                img: 'http://123.56.105.145/tubiao/messy/9.svg',
                url: $('#noLoading#').lazyRule(() => {
                    refreshPage(false)
                    return 'hiker://empty'
                }),
                col_type: 'text_icon',
                extra: {

                }
            })
            let recommendVod = playinfo.recommendVod;
            recommendVod.forEach(data => {
                d.push({
                    title: data.vod_name,
                    desc: data.new_continue,
                    img: data.vod_pic,
                    url: $('hiker://empty?#immersiveTheme#').rule(() => {
                        if (MY_PARAMS.vod_id != getMyVar('vod_id_1')) {
                            clearMyVar('playinfo');
                            clearMyVar('Vurl')
                            putMyVar('vod_id_1', MY_PARAMS.vod_id)
                        }
                        $.require("csdown").videoerji();
                    }),
                    col_type: 'movie_3',
                    extra: {
                        vod_id: data.vod_id,
                        vod_name: data.vod_name,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    search: function() {
        var d = this.d;
        var d_ = this.d_;
        let pg = MY_PAGE;
        if (MY_PAGE == 1) {
            d_.push({
                title: '',
                col_type: 'rich_text',
            })
            d_.push({   
                title: "搜索 ",
                url: $.toString(() => {
                    putMyVar('keyword', input)
                    refreshPage(false)
                    return "hiker://empty"
                }),
                   desc: "请输入搜索关键词",
                   col_type: "input",
                extra: {
                    defaultValue: getMyVar('keyword', ''),
                    pageTitle: '搜索结果'
                }
            })
            if (getMyVar('a', '') == '') {
                this.host_url()
            }
            let search_1 = [{
                title: '视频&小说&漫画',
                id: '1&2&3'
            }];
            this.Cate(search_1, 'search_1', d_, 'text_3');
            let search_cate_1 = getMyVar('search_1', '1');
            if (search_cate_1 == '1') {
                if (!storage0.getItem('search_order_list')) {
                    let search_order_list = [{
                        "name": "全部",
                        "t_id": 0
                    }, {
                        "name": "电影",
                        "t_id": 1
                    }, {
                        "name": "电视剧",
                        "t_id": 2
                    }, {
                        "name": "综艺",
                        "t_id": 3
                    }, {
                        "name": "动漫",
                        "t_id": 4
                    }, {
                        "name": "短剧",
                        "t_id": 64
                    }];
                    storage0.setItem('search_order_list', search_order_list);
                }
                let search_order_list = storage0.getItem('search_order_list');
                putMyVar('search_order_index', search_order_list[0].t_id);
                let search_order = getMyVar('search_order', getMyVar('search_order_index'));
                search_order_list.forEach((data, index) => {
                    d_.push({
                        title: search_order == data.t_id ? this.strong(data.name, 'ff6699') : data.name,
                        url: $('#noLoading#').lazyRule((n, id, name) => {
                            return $.require("csdown").search_order(id);
                        }, 'search_order', data.t_id, data.name),
                        col_type: 'scroll_button',
                        extra: {
                            backgroundColor: search_order == data.t_id ? "#20FA7298" : "",
                            id: 'search_cate_' + index,
                        }
                    })
                })
                d_.push({
                    col_type: 'blank_block',
                    extra: {
                        id: 'search_cate_blank',
                    }
                })
                if (!storage0.getItem('findOrder_list')) {
                    let findOrder_list = this.post('/App/Index/findOrder');
                    storage0.setItem('findOrder_list', findOrder_list);
                }
                let findOrder_list = storage0.getItem('findOrder_list');
                putMyVar('findOrder_index', findOrder_list[0].order_val);
                let findOrder = getMyVar('findOrder', getMyVar('findOrder_index'));
                findOrder_list.forEach(data => {
                    d_.push({
                        title: findOrder == data.order_val ? this.strong(data.order_key, 'ff6699') : data.order_key,
                        url: $('#noLoading#').lazyRule((n, id, name) => {
                            putMyVar(n, id);
                            refreshPage(false);
                            return 'hiker://empty';
                        }, 'findOrder', data.order_val, data.order_key),
                        col_type: 'scroll_button',
                        extra: {
                            backgroundColor: findOrder == data.order_val ? "#20FA7298" : "",
                        }
                    })
                })
                d_.push({
                    img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                    url: "hiker://empty",
                    col_type: "pic_1_full",
                    extra: {
                        id: "loading_"
                    }
                });
                setPreResult(d_)
                d.push({
                    col_type: 'blank_block',
                    extra: {
                        id: 'search_blank'
                    }
                })
                let body = JSON.stringify({
                    'keywords': getMyVar('keyword', ''),
                    'order_val': findOrder,
                })
                let list = this.post('/App/Index/findMoreVod', body).list;
                list.forEach(data => {
                    d.push({
                        title: data.vod_name + '\n““””' + ('上映时间：' + data.vod_year + '\n地区：' + data.vod_area).small(),
                        desc: '评分：' + data.vod_scroe + '\n更新状态：' + data.new_continue + '\n演员：' + data.vod_actor,
                        img: data.vod_pic,
                        url: $('hiker://empty?#immersiveTheme#').rule(() => {
                            $.require("csdown").videoerji();
                        }),
                        col_type: 'movie_1_vertical_pic',
                        extra: {
                            vod_id: data.vod_id,
                            vod_name: data.vod_name,
                            lineVisible: false,
                            cls: 'search_',
                            t_id: data.t_id,
                        }
                    })
                })
                deleteItem("loading_");
                setResult(d)
                storage0.putMyVar('search_find', findItemsByCls('search_'));
            }
        };
        let search_cate_1 = getMyVar('search_1', '1');
        if (search_cate_1 == '2') {
            if (MY_PAGE == 1) {
                d_.push({
                    img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                    url: "hiker://empty",
                    col_type: "pic_1_full",
                    extra: {
                        id: "loading_"
                    }
                });
                setPreResult(d_);
            }
            let search_novel = this.post('/ant_read/book/search', JSON.stringify({
                "page_num": pg + '',
                "keyword": getMyVar('keyword')
            })).list;
            search_novel.forEach(data => {
                d.push({
                    title: data.name,
                    desc: data.total_chapter + '章',
                    img: data.cover,
                    url: $('hiker://empty?id=' + data.book_id + '&#immersiveTheme##autoCache#').rule(() => {
                        $.require('csdown').novelerji();
                    }),
                    col_type: 'movie_3',
                    extra: {
                        novel_id: data.book_id,
                        novel_name: data.name,
                        novel_author: data.author,
                    }
                })
            })
            deleteItem('loading_');
            setResult(d)
        } else if (search_cate_1 == '3') {
            if (MY_PAGE == 1) {
                d_.push({
                    img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                    url: "hiker://empty",
                    col_type: "pic_1_full",
                    extra: {
                        id: "loading_"
                    }
                });
                setPreResult(d_);
            }
            let search_comic = this.post('/ant_read/comic/search', JSON.stringify({
                "page_num": pg + '',
                "keyword": getMyVar('keyword')
            })).list;
            search_comic.forEach(data => {
                d.push({
                    title: data.name,
                    desc: '共' + data.total_chapters + '话',
                    img: data.cover,
                    url: $('hiker://empty?id=' + data.comic_id + '&type=漫画&#immersiveTheme##autoCache#').rule(() => {
                        $.require('csdown').comicerji();
                    }),
                    col_type: 'movie_3',
                    extra: {
                        comic_id: data.comic_id,
                        comic_name: data.name,
                    }
                })
            })
            deleteItem('loading_');
            setResult(d)
        }
    },
    search_order: function(id) {
        try {
            let search_order_list = storage0.getItem('search_order_list');
            putMyVar('search_order', id);
            let search_order = getMyVar('search_order', getMyVar('search_order_index'));
            search_order_list.forEach((data, index) => {
                updateItem('search_cate_' + index, {
                    title: search_order == data.t_id ? this.strong(data.name, 'ff6699') : data.name,
                    extra: {
                        backgroundColor: search_order == data.t_id ? "#20FA7298" : "",
                        id: 'search_cate_' + index,
                    }
                })
            })
            let search_find_list = storage0.getMyVar('search_find') || [];
            let search_list = [];
            if (id == '0') {
                search_find_list.forEach(item => {
                    item.col_type = item.type;
                });
                search_list = search_find_list;
            } else {
                search_find_list.forEach(item => {
                    if (id == item.extra.t_id) {
                        item.col_type = item.type;
                        search_list.push(item);
                    }
                })
            }
            deleteItemByCls('search_');
            addItemAfter('search_blank', search_list)
        } catch (e) {
            log(e.message)
            toast('出现错误，请下滑刷新后重试！')
        }
        return 'hiker://empty';
    },
    cate: function() {
        var d = this.d;
        var d_ = this.d_;
        var pg = MY_PAGE;
        try {
            if (MY_PAGE == 1) {
                if (!storage0.getItem('indexPid', '')) {
                    let indexPid = this.post('/App/Index/indexPid');
                    storage0.setItem('indexPid', indexPid);
                }
                let indexPid = storage0.getItem('indexPid');
                putMyVar('cate_t_id_index', indexPid[0].t_id);
                putMyVar('cate_pid_index', indexPid[0].pid);
                let cate_t_id = getMyVar('cate_t_id', getMyVar('cate_t_id_index'));
                let cate_pid = getMyVar('cate_pid', getMyVar('cate_pid_index'));
                indexPid.forEach(data => {
                    d_.push({
                        title: cate_pid == data.pid ? this.strong(data.name, 'ff6699') : data.name,
                        url: $('#noLoading#').lazyRule((t_id, pid, name) => {
                            putMyVar('cate_t_id', t_id);
                            putMyVar('cate_pid', pid);
                            refreshPage(false);
                            return 'hiker://empty';
                        }, data.t_id, data.pid, data.name),
                        col_type: 'scroll_button',
                        extra: {
                            backgroundColor: cate_pid == data.pid ? "#20FA7298" : "",
                            t_id: data.t_id,
                            pid: data.pid,
                        }
                    })
                })
                if (!storage0.getMyVar('indexlist_' + cate_pid)) {
                    d_.push({
                        img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                        url: "hiker://empty",
                        col_type: "pic_1_full",
                        extra: {
                            id: "loading_"
                        }
                    });
                }
                setPreResult(d_);
                if (!storage0.getMyVar('banner_' + cate_pid)) {
                    let body = JSON.stringify({
                        "pid": cate_pid
                    });
                    let banner = this.post('/App/Ad/bannerInfo', body).list;
                    let banner_ = [];
                    banner.forEach(data => {
                        if (!/游戏平台/.test(data.banner_content)) {
                            banner_.push({
                                vod_name: data.target_name,
                                vod_pic: data.slide_pic,
                                vod_id: data.vod_id,
                            })
                        }
                    })
                    storage0.putMyVar('banner_' + cate_pid, banner_);
                }
                this.banner(MY_RULE.title, true, d, storage0.getMyVar('banner_' + cate_pid), {
                    time: 5000,
                    col_type: 'card_pic_1',
                    desc: '0'
                });
                d.push({
                    title: this.color('更多分类'),
                    img: 'hiker://images/icon_right5',
                    url: $('hiker://empty?page=fypage&#gameTheme#').rule(() => {
                        $.require("csdown").cate_more()
                    }),
                    col_type: 'text_icon',
                    extra: {
                        t_id: cate_t_id,
                        lineVisible: false,
                    }
                })
                if (!storage0.getMyVar('cate_t_id_' + cate_t_id)) {
                    let body = JSON.stringify({
                        "t_id": cate_t_id
                    });
                    let cate_t_id_list = this.post('/App/IndexList/indexScreen', body);
                    storage0.putMyVar('cate_t_id_' + cate_t_id, cate_t_id_list)
                }
                if (!storage0.getMyVar('indexlist_' + cate_pid)) {
                    let indexlist_body = JSON.stringify({
                        "pid": cate_pid
                    });
                    let indexlist = this.post('/App/IndexList/index', indexlist_body).list;
                    storage0.putMyVar('indexlist_' + cate_pid, indexlist);
                }
                let indexlist = storage0.getMyVar('indexlist_' + cate_pid);
                indexlist.slice(0, 1).forEach(item => {
                    d.push({
                        title: this.color(item.type),
                        img: 'hiker://images/icon_right5',
                        url: $('hiker://empty?#gameTheme#').rule(() => {
                            $.require("csdown").cate_erji_1()
                        }),
                        col_type: 'text_icon',
                        extra: {
                            pid: item.pid,
                        },
                    })
                    item.list.forEach(data => {
                        d.push({
                            title: data.c_name || data.vod_name,
                            desc: data.new_continue + '  ' + (data.vod_douban_score ? data.vod_douban_score : ''),
                            img: data.c_pic || data.vod_pic,
                            url: $('hiker://empty?#immersiveTheme#').rule(() => {
                                $.require("csdown").videoerji();
                            }),
                            col_type: 'movie_2',
                            extra: {
                                vod_id: data.vod_id,
                                vod_name: data.c_name || data.vod_name,
                            }
                        })
                    })
                })
                indexlist.slice(1).forEach(item => {
                    d.push({
                        title: this.color(item.type),
                        img: 'hiker://images/icon_right5',
                        url: $('hiker://empty?#gameTheme#').rule(() => {
                            $.require("csdown").cate_erji_2()
                        }),
                        col_type: 'text_icon',
                        extra: {
                            pid: item.pid,
                            type: item.type,
                            show_id: item.show_id,
                        },
                    })
                    item.list.forEach(data => {
                        d.push({
                            title: data.vod_name,
                            desc: data.new_continue + '  ' + data.vod_scroe,
                            img: data.vod_pic,
                            url: $('hiker://empty?#immersiveTheme#').rule(() => {
                                $.require("csdown").videoerji();
                            }),
                            col_type: 'movie_3',
                            extra: {
                                vod_id: data.vod_id,
                                vod_name: data.vod_name,
                            }
                        })
                    })
                })
            }
        } catch (e) {
            log(e.message)
        }
    },
    cate_more: function() {
        var d = this.d;
        var d_ = this.d_;
        let id = MY_PARAMS.t_id;
        let pg = MY_PAGE;
        let cate_t_id_list = storage0.getMyVar('cate_t_id_' + id);
        let fliter = ['column', 'area', 'year', 'sort'];
        if (MY_PAGE == 1) {
            d_.push({
                title: '',
                url: 'hiker://empty',
                col_type: 'rich_text',
            })
            fliter.forEach((item_1, index_1) => {
                if (cate_t_id_list[item_1] && cate_t_id_list[item_1].length > 0) {
                    putMyVar('cate_t_id_index_' + item_1, cate_t_id_list[item_1][0].value);
                    cate_t_id_list[item_1].forEach((data, index_2) => {
                        d_.push({
                            title: getMyVar('cate_t_id_' + item_1, getMyVar('cate_t_id_index_' + item_1)) == data.value ? this.strong(data.name, 'ff6699') : data.name,
                            url: $('#noLoading#').lazyRule((n, id, name) => {
                                putMyVar(n, id);
                                refreshPage(false);
                                return 'hiker://empty';
                            }, 'cate_t_id_' + item_1, data.value, data.name),
                            col_type: 'scroll_button',
                            extra: {
                                backgroundColor: getMyVar('cate_t_id_' + item_1, getMyVar('cate_t_id_index_' + item_1)) == data.value ? "#20FA7298" : "",
                            }
                        })
                    })
                }
                d_.push({
                    col_type: 'blank_block',
                    extra: {

                    }
                })
            })
            d_.push({
                img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                url: "hiker://empty",
                col_type: "pic_1_full",
                extra: {
                    id: "loading_"
                }
            });
            setPreResult(d_)
        }
        let index_list_body = {};
        fliter.forEach((item_1, index_1) => {
            if (cate_t_id_list[item_1] && cate_t_id_list[item_1].length > 0) {
                index_list_body[item_1.replace('column', 'tid')] = getMyVar('cate_t_id_' + item_1, getMyVar('cate_t_id_index_' + item_1));
            } else if (item_1 == 'column') {
                index_list_body['tid'] = id;
            }
        })
        index_list_body.page = pg + '';
        index_list_body.pageSize = '30';
        let index_list = this.post('/App/IndexList/indexList', JSON.stringify(index_list_body)).list;
        index_list.forEach(data => {
            d.push({
                title: data.vod_name,
                desc: data.new_continue + '  ' + data.vod_scroe,
                img: data.vod_pic,
                url: $('hiker://empty?#immersiveTheme#').rule(() => {
                    $.require("csdown").videoerji();
                }),
                col_type: 'movie_3',
                extra: {
                    vod_id: data.vod_id,
                    vod_name: data.vod_name,
                }
            })
        })
        deleteItem("loading_");
        setResult(d)
    },
    cate_erji_1: function() {
        var d = this.d;
        var d_ = this.d_;
        let id = MY_PARAMS.pid;
        d_.push({
            title: '',
            url: 'hiker://empty',
            col_type: 'rich_text',
        })
        d_.push({
            img: "http://123.56.105.145/weisyr/img/Loading1.gif",
            url: "hiker://empty",
            col_type: "pic_1_full",
            extra: {
                id: "loading_"
            }
        });
        setPreResult(d_)
        let cate_erji_body = JSON.stringify({
            "pid": id
        });
        let cate_erji_list = this.post('/App/IndexList/choiceList', cate_erji_body).list;
        cate_erji_list.forEach(data => {
            d.push({
                title: data.c_name,
                desc: data.new_continue + '  ' + data.vod_douban_score,
                img: data.c_pic,
                url: $('hiker://empty?#immersiveTheme#').rule(() => {
                    $.require("csdown").videoerji();
                }),
                col_type: 'movie_2',
                extra: {
                    vod_id: data.vod_id,
                    vod_name: data.c_name,
                }
            })
        })
        deleteItem("loading_");
        setResult(d)
    },
    cate_erji_2: function() {
        var d = this.d;
        var d_ = this.d_;
        let pid = MY_PARAMS.pid;
        let show_id = MY_PARAMS.show_id;
        d_.push({
            title: '',
            url: 'hiker://empty',
            col_type: 'rich_text',
        })
        d_.push({
            img: "http://123.56.105.145/weisyr/img/Loading1.gif",
            url: "hiker://empty",
            col_type: "pic_1_full",
            extra: {
                id: "loading_"
            }
        });
        setPreResult(d_)
        let cate_erji_body = JSON.stringify({
            "show_id": show_id,
            "pid": pid
        });
        let cate_erji_list = this.post('/App/IndexList/hotsList', cate_erji_body).list;
        cate_erji_list.forEach(data => {
            d.push({
                title: data.vod_name,
                desc: data.new_continue + '  ' + data.vod_scroe,
                img: data.vod_pic,
                url: $('hiker://empty?#immersiveTheme#').rule(() => {
                    $.require("csdown").videoerji();
                }),
                col_type: 'movie_3',
                extra: {
                    vod_id: data.vod_id,
                    vod_name: data.vod_name,
                }
            })
        })
        deleteItem("loading_");
        setResult(d)
    },
    microvod: function() {
        var d = this.d;
        var d_ = this.d_;
        var pg = MY_PAGE;
        let microvod;
        try {
            if (MY_PAGE == 1) {
                if (!storage0.getItem('cate_microvod')) {
                    let cate_microvod = this.post('/App/Resource/Vod/microVodTab').list;
                    storage0.setItem('cate_microvod', cate_microvod)
                }
                let cate_microvod = storage0.getItem('cate_microvod');
                putMyVar('microvod_index', cate_microvod[0].id);
                microvod = getMyVar('microvod', getMyVar('microvod_index'));
                cate_microvod.forEach(data => {
                    d_.push({
                        title: microvod == data.id ? this.strong(data.module_name, 'ff6699') : data.module_name,
                        url: $('#noLoading#').lazyRule((n, id, name) => {
                            putMyVar(n, id);
                            refreshPage(false);
                            return 'hiker://empty';
                        }, 'microvod', data.id, data.module_name),
                        col_type: 'scroll_button',
                        extra: {
                            cate_id: data.id,
                            backgroundColor: microvod == data.id ? "#20FA7298" : "",
                        }
                    })
                })
                if (!storage0.getMyVar('microvod_' + microvod + pg)) {
                    d_.push({
                        col_type: 'blank_block',
                        extra: {
                            id: 'blank_3',
                        }
                    }, {
                        img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                        url: "hiker://empty",
                        col_type: "pic_1_full",
                        extra: {
                            id: "loading_"
                        }
                    });
                }
                setPreResult(d_)
            }
            let cate_microvod = storage0.getItem('cate_microvod');
            microvod = getMyVar('microvod', getMyVar('microvod_index'));
            if (!storage0.getMyVar('microvod_' + microvod + pg)) {
                let microvod_type = cate_microvod.find((_, i) => _.id == microvod).micro_type;
                let microvod_body = JSON.stringify({
                    "micro_type": microvod_type + '',
                    "pageSize": "20",
                    "pid": microvod + '',
                    "page": pg + '',
                });
                //log(microvod_body)
                let microvod_list = this.post('/App/Resource/Vod/microVodList', microvod_body).list;
                storage0.putMyVar('microvod_' + microvod + pg, microvod_list)
            }
            let microvod_list = storage0.getMyVar('microvod_' + microvod + pg);
            microvod_list.forEach(data => {
                d.push({
                    title: data.name,
                    desc: '““””' + this.addressTag($('hiker://empty?#immersiveTheme#').b64().rule(() => {
                        $.require("csdown").videoerji();
                    }), '点此观看全集'),
                    img: data.pic_url.replace('jjawa.com', '67c6c7a.com'),
                    //img:data.pic_url,
                    url: data.default_play_url + ';{User-Agent@Lavf/57.83.100}',
                    col_type: 'movie_1_vertical_pic',
                    extra: {
                        lineVisible: false,
                        vod_id: data.related_id || data.vod_id,
                        vod_name: data.name,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
    },
    jiexi: function(id, vurl_id) {
        try {
            let names;
            if (getItem('jiexi_mode', '0') == '0') {
                names = ['1080'];
            } else if (getItem('jiexi_mode', '0') == '1') {
                names = ['1080', '720'];
            } else if (getItem('jiexi_mode', '0') == '2') {
                names = ['1080', '720', '480'];
            };
            let headers = [];
            urls = names.map(data => {
                headers.push({
                    //'referer': 'http://WJiZxLXA2.com/',
                    'User-Agent': 'Lavf/57.83.100',
                })
                let request_key = JSON.stringify({
                    "domain_type": "8",
                    "vod_id": id,
                    "type": "play",
                    "resolution": data,
                    "vurl_id": vurl_id
                });
                let line_url = this.post('/App/Resource/VurlDetail/showOne', request_key).url;
                return line_url;
            })
            return {
                urls: urls,
                names: names,
                headers: headers
            }
        } catch (e) {
            log(e.message)
            return 'toast://未获取到链接'
        }
    },
    shsort: function() {
        let shsort = getMyVar('shsort');
        putMyVar('shsort', shsort == '1' ? '0' : '1');
        shsort = getMyVar('shsort');
        try {
            let urls = findItemsByCls("选集_") || [];
            deleteItemByCls('选集_');
            urls.reverse();
            urls.forEach(item => {
                item.col_type = item.type;
            });
            updateItem('排序', {
                title: (shsort == '1') ? '““””<b><span style="color: #FF0000">逆序</span></b>' : '““””<b><span style="color: #1aad19">正序</span></b>',
            })
            addItemBefore('blank', urls);
            toast('切换排序成功');
        } catch (e) {
            refreshPage(false)
        }
        return 'hiker://empty';
    },
    novel: function() {
        var d = this.d;
        var d_ = this.d_;
        var pg = MY_PAGE;
        let novel;
        try {
            if (MY_PAGE == 1) {
                if (!storage0.getMyVar('novel_' + pg)) {
                    d_.push({
                        col_type: 'blank_block',
                        extra: {
                            id: 'blank_3',
                        }
                    }, {
                        img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                        url: "hiker://empty",
                        col_type: "pic_1_full",
                        extra: {
                            id: "loading_"
                        }
                    });
                    setPreResult(d_)
                    if (!storage0.getMyVar('read_index')) {
                        let read_index = this.post('/ant_read/top-menu-icon/index').list;
                        storage0.putMyVar('read_index', read_index)
                    };
                }
                let recommend_id_list = storage0.getMyVar('read_index')[0].recommend_id_list.join(',');
                if (!storage0.getMyVar('novel_1')) {
                    let novel_body = JSON.stringify({
                        "recommend_id": recommend_id_list,
                        "limit": "20",
                        "page": pg + '',
                    });
                    let novel_list = this.post('/ant_read/book-channel-list/label-new', novel_body);
                    storage0.putMyVar('novel_1', novel_list)
                }
                let novel_list = storage0.getMyVar('novel_1').label;
                novel_list.forEach(data => {
                    d.push({
                        title: this.color(data.label),
                        img: 'hiker://images/icon_right5',
                        url: $('hiker://empty?page=fypage&#gameTheme#&#noHistory#').rule(() => {
                            $.require('csdown').novel_more()
                        }),
                        col_type: 'text_icon',
                        extra: {
                            recommend_id: data.recommend_id,
                            label: data.label,
                        }
                    })
                    data.list.forEach(data => {
                        d.push({
                            title: data.name,
                            desc: data.total_chapters + '章',
                            img: data.cover,
                            url: $('hiker://empty?id=' + data.book_id + '&#immersiveTheme##autoCache#').rule(() => {
                                $.require('csdown').novelerji();
                            }),
                            col_type: 'movie_3',
                            extra: {
                                novel_id: data.book_id,
                                novel_name: data.name,
                                novel_author: data.author,
                            }
                        })
                    })
                })
            } else {
                if (!storage0.getMyVar('novel_' + pg)) {
                    let novel_body = JSON.stringify({
                        "recommend_id": "60",
                        "limit": "20",
                        "page": pg + '',
                        "position": "1",
                        "icon_type": "1"
                    });
                    let novel_list = this.post('/ant_read/top-recommend/book-comic-list', novel_body);
                    storage0.putMyVar('novel_' + pg, novel_list)
                }
                let novel_list = storage0.getMyVar('novel_' + pg).list;
                novel_list.forEach(data => {
                    d.push({
                        title: data.name,
                        desc: data.total_chapters + '章',
                        img: data.cover,
                        url: $('hiker://empty?id=' + data.book_id + '&#immersiveTheme##autoCache#').rule(() => {
                            $.require('csdown').novelerji();
                        }),
                        col_type: 'movie_3',
                        extra: {
                            novel_id: data.book_id,
                            novel_name: data.name,
                            novel_author: data.author,
                        }
                    })
                })
            }
        } catch (e) {
            log(e.message)
        }
    },
    novel_more: function() {
        var d = this.d;
        var d_ = this.d_;
        let id = MY_PARAMS.recommend_id;
        let label = MY_PARAMS.label;
        let pg = MY_PAGE;
        if (MY_PAGE == 1) {
            d_.push({
                title: '',
                url: 'hiker://empty',
                col_type: 'rich_text',
            })
            d_.push({
                title: this.strong(label, 'ff6699'),
                url: 'hiker://empty',
                col_type: 'text_center_1',
                extra: {
                    lineVisible: false,
                }
            })
            d_.push({
                img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                url: "hiker://empty",
                col_type: "pic_1_full",
                extra: {
                    id: "loading_"
                }
            });
            setPreResult(d_)
        }
        let recommend = this.post('/ant_read/book/recommend', JSON.stringify({
            "recommend_id": id,
            "page_num": pg + '',
            "page_size": "20"
        })).list.list;
        recommend.forEach(data => {
            d.push({
                title: data.name,
                desc: data.total_chapter + '章',
                img: data.cover,
                url: $('hiker://empty?id=' + data.book_id + '&#immersiveTheme##autoCache#').rule(() => {
                    $.require('csdown').novelerji();
                }),
                col_type: 'movie_3',
                extra: {
                    novel_id: data.book_id,
                    novel_name: data.name,
                    novel_author: data.author,
                }
            })
        })
        deleteItem('loading_');
        setResult(d)
    },
    novelerji: function() {
        var d = this.d;
        let id = MY_PARAMS.novel_id;
        let pg = +getMyVar('gzapp_page_' + id, '0') + 1;
        setPageTitle(MY_PARAMS.novel_name);
        try {
            if (!storage0.getMyVar('bookinfo' + id)) {
                let request_key = JSON.stringify({
                    "book_id": id,
                })
                let bookinfo = this.post('/ant_read/novel/info', request_key);
                storage0.putMyVar('bookinfo' + id, bookinfo);
            }
            let bookinfo = storage0.getMyVar('bookinfo' + id);
            if (!storage0.getMyVar('novel_chapter' + id + pg)) {
                let novel_chapter = this.post('/ant_read/chapter/catalog', JSON.stringify({
                    "orderby": "1",
                    "book_id": id,
                    "page": pg + '',
                    "position": "0"
                }));
                storage0.putMyVar('novel_chapter' + id + pg, novel_chapter);
            }
            let novel_chapter = storage0.getMyVar('novel_chapter' + id + pg);
            let book = bookinfo.book;
            setPageTitle(book.name);
            d.push({
                title: book.name + '\n' + ('‘‘’’作者：' + book.author + '\n字数：' + book.display_label).small(),
                desc: '状态：' + book.book_status + book.last_chapter + '\n' + ('‘‘’’更新时间：' + book.last_chapter_time),
                img: book.cover,
                url: $('hiker://empty?#gameTheme#').rule((pic, name, actor, label, new_continue, time, description) => {
                    var d = []
                    d.push({
                        img: pic,
                        url: pic + '#.jpg#',
                        col_type: 'pic_1_full'
                    }, {
                        title: '小说名：' + name,
                        col_type: 'rich_text'
                    }, {
                        title: '作者：' + actor,
                        col_type: 'rich_text'
                    }, {
                        title: '字数：' + label,
                        col_type: 'rich_text',
                    }, {
                        title: '更新状态：' + new_continue,
                        col_type: 'rich_text',
                    }, {
                        title: '最后更新：' + time,
                        col_type: 'rich_text',
                    }, {
                        title: '简介：' + description,
                        col_type: 'rich_text',
                    }, )
                    setResult(d)
                }, book.cover, book.name, book.author, book.display_label, book.book_status + book.last_chapter, book.last_chapter_time, book.description),
                col_type: 'movie_1_vertical_pic_blur',
                extra: {
                    gradient: true
                }
            })
            this.setDesc(d, book.description);
            d.push({
                title: (getMyVar('shsort', '0') == '1') ? '““””<b><span style="color: #FF0000">逆序</span></b>' : '““””<b><span style="color: #1aad19">正序</span></b>',
                url: $('#noLoading#').lazyRule(() => {
                    return $.require("csdown").shsort();
                }),
                col_type: 'text_center_1',
                extra: {
                    id: '排序',
                    lineVisible: false,
                    longClick: [{
                        title: '当前样式：' + getItem('pic_col_type', 'text_2'),
                        js: $.toString(() => {
                            //let options = ['text_1', 'text_2', 'text_3', 'text_4', 'text_center_1', 'avatar', 'text_icon', 'icon_1_left_pic'];
                            //log(getColTypes())
                            let options = getColTypes();
                            let Line = {
                                title: '切换样式',
                                options: options,
                                selectedIndex: options.indexOf(getItem('pic_col_type', 'text_2')),
                                col: 2,
                                js: $.toString((options) => {
                                    setItem('pic_col_type', input);
                                    refreshPage(false);
                                    toast('样式切换为：' + input);
                                }, options)
                            }
                            return 'select://' + JSON.stringify(Line);
                        })
                    }],
                }
            })
            let 分页链接 = [];
            let 分页名 = [];
            let pageid = +getMyVar('gzapp_page_' + id, '0');
            let 分页页码 = pageid + 1;
            for (let i = 0; i < novel_chapter.total_page; i++) {
                分页链接.push($("#noLoading#").lazyRule((pageurl, nowid, newid) => {
                    if (nowid != newid) {
                        putMyVar(pageurl, newid);
                        refreshPage(false);
                    }
                    return 'hiker://empty'
                }, "gzapp_page_" + id, pageid + '', i + ''))
                let start = i * 20 + 1;
                let end = i * 20 + 20;
                let title = start + ' - ' + end;
                分页名.push(pageid == i ? '““””<span style="color: #3399cc">' + title : title)
            }
            d.push({
                title: '尾页',
                url: $('#noLoading#').lazyRule((pageurl, nowid, newid) => {
                    if (nowid != newid) {
                        putMyVar(pageurl, newid);
                        refreshPage(false);
                    }
                    return "hiker://empty";
                }, "gzapp_page_" + id, pageid + '', novel_chapter.total_page - 1 + ''),
                col_type: 'text_4',
            })
            d.push({
                title: 分页名[pageid],
                url: $(分页名, 2).select((分页名, 分页链接) => {
                    return 分页链接[分页名.indexOf(input)];
                }, 分页名, 分页链接),
                col_type: 'text_2',
            })
            d.push({
                title: '下页',
                url: $('#noLoading#').lazyRule((pageurl, nowid, newid, total_page) => {
                    if (nowid != newid && +newid < total_page) {
                        putMyVar(pageurl, newid);
                        refreshPage(false);
                    }
                    return "hiker://empty";
                }, "gzapp_page_" + id, pageid + '', pageid + 1 + '', novel_chapter.total_page),
                col_type: 'text_4',
            })
            try {
                let urls = novel_chapter.chapter_list;
                if (getMyVar('shsort', '0') == '1') {
                    urls.reverse()
                }
                if (urls && urls.length == 0) {
                    d.push({
                        title: '小说下架或未上传，请选择其他小说观看',
                        url: 'hiker://empty',
                        col_type: 'text_center_1',
                        extra: {
                            lineVisible: false
                        }
                    })
                }
                let col = urls[0].chapter_title.length > 5 ? 'text_1' : 'text_2';
                urls.forEach(data => {
                    d.push({
                        title: data.chapter_title,
                        url: $('hiker://empty?chapter_id=' + data.chapter_id + '&#autoPage#&#readTheme#').rule(() => {
                            $.require("csdown").novel_jx();
                        }),
                        col_type: getItem('pic_col_type', col),
                        extra: {
                            cls: '选集_',
                            book_id: id,
                            chapter_id: data.chapter_id,
                        }
                    })
                })
            } catch (e) {
                log(e.message)
            }
            d.push({
                col_type: 'blank_block',
                extra: {
                    id: 'blank',
                }
            }, {
                title: '<b><span style="color: #ff847c">推荐</span></b>',
                img: 'http://123.56.105.145/tubiao/messy/9.svg',
                url: $('#noLoading#').lazyRule(() => {
                    refreshPage(false)
                    return 'hiker://empty'
                }),
                col_type: 'text_icon',
                extra: {

                }
            })
            let label = bookinfo.label[0].list;
            label.forEach(data => {
                d.push({
                    title: data.name,
                    desc: data.total_chapters + '章',
                    img: data.cover,
                    url: $('hiker://empty?id=' + data.book_id + '&#immersiveTheme##autoCache#').rule(() => {
                        $.require('csdown').novelerji();
                    }),
                    col_type: 'movie_3',
                    extra: {
                        novel_id: data.book_id,
                        novel_name: data.name,
                        novel_author: data.author,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    novel_jx: function() {
        var d = this.d;
        let id = MY_PARAMS.book_id;
        let chapter_id = MY_PARAMS.chapter_id;
        let data = this.post('/ant_read/chapter/text', JSON.stringify({
            "book_id": id,
            "chapter_id": chapter_id
        }))
        d.push({
            title: '<h3 style="text-align:center;">' + data.chapter_title,
            url: 'hiker://empty',
            col_type: 'rich_text',
            extra: {
                lineVisible: false
            }
        }, {
            title: '&emsp;  ' + data.content.replace(/\n/g, '<br>&emsp;  '),
            col_type: 'rich_text',
        })
        setResult(d)
    },
    comic: function() {
        var d = this.d;
        var d_ = this.d_;
        var pg = MY_PAGE;
        let comic;
        try {
            if (MY_PAGE == 1) {
                if (!storage0.getMyVar('comic_' + pg)) {
                    d_.push({
                        col_type: 'blank_block',
                        extra: {
                            id: 'blank_3',
                        }
                    }, {
                        img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                        url: "hiker://empty",
                        col_type: "pic_1_full",
                        extra: {
                            id: "loading_"
                        }
                    });
                    setPreResult(d_)
                    if (!storage0.getMyVar('read_index')) {
                        let read_index = this.post('/ant_read/top-menu-icon/index').list;
                        storage0.putMyVar('read_index', read_index)
                    };
                }
                let recommend_id_list = storage0.getMyVar('read_index')[1].recommend_id_list.join(',');
                if (!storage0.getMyVar('comic_1')) {
                    let comic_body = JSON.stringify({
                        "recommend_id": recommend_id_list,
                        "limit": "20",
                        "page": pg + '',
                    });
                    let comic_list = this.post('/ant_read/comic-channel-list/label-new', comic_body);
                    storage0.putMyVar('comic_1', comic_list)
                }
                let comic_list = storage0.getMyVar('comic_1').label;
                comic_list.forEach(data => {
                    d.push({
                        title: this.color(data.label),
                        img: 'hiker://images/icon_right5',
                        url: $('hiker://empty?page=fypage&#gameTheme#&#noHistory#').rule(() => {
                            $.require('csdown').comic_more()
                        }),
                        col_type: 'text_icon',
                        extra: {
                            recommend_id: data.recommend_id,
                            label: data.label,
                        }
                    })
                    data.list.forEach(data => {
                        d.push({
                            title: data.name,
                            desc: '共' + data.total_chapters + '话',
                            img: data.vertical_cover,
                            url: $('hiker://empty?id=' + data.comic_id + '&type=漫画&#immersiveTheme##autoCache#').rule(() => {
                                $.require('csdown').comicerji();
                            }),
                            col_type: 'movie_3',
                            extra: {
                                comic_id: data.comic_id,
                                comic_name: data.name,
                            }
                        })
                    })
                })
            } else {
                if (!storage0.getMyVar('comic_' + pg)) {
                    let comic_body = JSON.stringify({
                        "recommend_id": "57",
                        "limit": "20",
                        "page": pg + '',
                        "position": "2",
                        "icon_type": "2"
                    });
                    let comic_list = this.post('/ant_read/top-recommend/book-comic-list', comic_body);
                    storage0.putMyVar('comic_' + pg, comic_list)
                }
                let comic_list = storage0.getMyVar('comic_' + pg).list;
                comic_list.forEach(data => {
                    d.push({
                        title: data.name,
                        desc: '共' + data.total_chapters + '话',
                        img: data.vertical_cover,
                        url: $('hiker://empty?id=' + data.comic_id + '&type=漫画&#immersiveTheme##autoCache#').rule(() => {
                            $.require('csdown').comicerji();
                        }),
                        col_type: 'movie_3',
                        extra: {
                            comic_id: data.comic_id,
                            comic_name: data.name,
                        }
                    })
                })
            }
        } catch (e) {
            log(e.message)
        }
    },
    comicerji: function() {
        var d = this.d;
        let id = MY_PARAMS.comic_id;
        let pg = +getMyVar('gzapp_page_comic_' + id, '0') + 1;
        setPageTitle(MY_PARAMS.comic_name);
        try {
            if (!storage0.getMyVar('comicinfo' + id)) {
                let request_key = JSON.stringify({
                    "comic_id": id,
                })
                let comicinfo = this.post('/ant_read/comic/info', request_key);
                storage0.putMyVar('comicinfo' + id, comicinfo);
            }
            let comicinfo = storage0.getMyVar('comicinfo' + id);
            if (!storage0.getMyVar('comic_chapter' + id + pg)) {
                let comic_chapter = this.post('/ant_read/comic/catalog', JSON.stringify({
                    "orderby": "1",
                    "comic_id": id,
                    "page": pg + '',
                    "position": "0"
                }));
                storage0.putMyVar('comic_chapter' + id + pg, comic_chapter);
            }
            let comic_chapter = storage0.getMyVar('comic_chapter' + id + pg);
            let comic = comicinfo.comic;
            setPageTitle(comic.name);
            d.push({
                title: comic.name + '\n' + ('‘‘’’作者：' + comic.author + '\n更新：' + comic.flag).small(),
                desc: '状态：' + comic.finished + ' ' + comic.last_chapter + '\n' + ('‘‘’’更新时间：' + comic.last_chapter_time),
                img: comic.cover,
                url: $('hiker://empty?#gameTheme#').rule((pic, name, actor, label, new_continue, time, description) => {
                    var d = []
                    d.push({
                        img: pic,
                        url: pic + '#.jpg#',
                        col_type: 'pic_1_full'
                    }, {
                        title: '漫画名：' + name,
                        col_type: 'rich_text'
                    }, {
                        title: '作者：' + actor,
                        col_type: 'rich_text'
                    }, {
                        title: '字数：' + label,
                        col_type: 'rich_text',
                    }, {
                        title: '更新状态：' + new_continue,
                        col_type: 'rich_text',
                    }, {
                        title: '最后更新：' + time,
                        col_type: 'rich_text',
                    }, {
                        title: '简介：' + description,
                        col_type: 'rich_text',
                    }, )
                    setResult(d)
                }, comic.cover, comic.name, comic.author, comic.flag, comic.finished + comic.last_chapter, comic.last_chapter_time, comic.description),
                col_type: 'movie_1_vertical_pic_blur',
                extra: {
                    gradient: true
                }
            })
            this.setDesc(d, comic.description);
            d.push({
                title: (getMyVar('shsort', '0') == '1') ? '““””<b><span style="color: #FF0000">逆序</span></b>' : '““””<b><span style="color: #1aad19">正序</span></b>',
                url: $('#noLoading#').lazyRule(() => {
                    return $.require("csdown").shsort();
                }),
                col_type: 'text_center_1',
                extra: {
                    id: '排序',
                    lineVisible: false,
                    longClick: [{
                        title: '当前样式：' + getItem('pic_col_type', 'text_2'),
                        js: $.toString(() => {
                            //let options = ['text_1', 'text_2', 'text_3', 'text_4', 'text_center_1', 'avatar', 'text_icon', 'icon_1_left_pic'];
                            //log(getColTypes())
                            let options = getColTypes();
                            let Line = {
                                title: '切换样式',
                                options: options,
                                selectedIndex: options.indexOf(getItem('pic_col_type', 'text_2')),
                                col: 2,
                                js: $.toString((options) => {
                                    setItem('pic_col_type', input);
                                    refreshPage(false);
                                    toast('样式切换为：' + input);
                                }, options)
                            }
                            return 'select://' + JSON.stringify(Line);
                        })
                    }],
                }
            })
            let 分页链接 = [];
            let 分页名 = [];
            let pageid = +getMyVar('gzapp_page_comic_' + id, '0');
            let 分页页码 = pageid + 1;
            for (let i = 0; i < comic_chapter.total_page; i++) {
                分页链接.push($("#noLoading#").lazyRule((pageurl, nowid, newid) => {
                    if (nowid != newid) {
                        putMyVar(pageurl, newid);
                        refreshPage(false);
                    }
                    return 'hiker://empty'
                }, "gzapp_page_comic_" + id, pageid + '', i + ''))
                let start = i * 20 + 1;
                let end = i * 20 + 20;
                let title = start + ' - ' + end;
                分页名.push(pageid == i ? '““””<span style="color: #3399cc">' + title : title)
            }
            d.push({
                title: '尾页',
                url: $('#noLoading#').lazyRule((pageurl, nowid, newid) => {
                    if (nowid != newid) {
                        putMyVar(pageurl, newid);
                        refreshPage(false);
                    }
                    return "hiker://empty";
                }, "gzapp_page_comic_" + id, pageid + '', comic_chapter.total_page - 1 + ''),
                col_type: 'text_4',
            })
            d.push({
                title: 分页名[pageid],
                url: $(分页名, 2).select((分页名, 分页链接) => {
                    return 分页链接[分页名.indexOf(input)];
                }, 分页名, 分页链接),
                col_type: 'text_2',
            })
            d.push({
                title: '下页',
                url: $('#noLoading#').lazyRule((pageurl, nowid, newid, total_page) => {
                    if (nowid != newid && +newid < total_page) {
                        putMyVar(pageurl, newid);
                        refreshPage(false);
                    }
                    return "hiker://empty";
                }, "gzapp_page_comic_" + id, pageid + '', pageid + 1 + '', comic_chapter.total_page),
                col_type: 'text_4',
            })
            try {
                let urls = comic_chapter.chapter_list;
                if (getMyVar('shsort', '0') == '1') {
                    urls.reverse()
                }
                if (urls && urls.length == 0) {
                    d.push({
                        title: '漫画下架或未上传，请选择其他小说观看',
                        url: 'hiker://empty',
                        col_type: 'text_center_1',
                        extra: {
                            lineVisible: false
                        }
                    })
                }
                let col = urls[0].chapter_title.length > 5 ? 'text_1' : 'text_2';
                urls.forEach(data => {
                    d.push({
                        title: data.chapter_title,
                        url: $().lazyRule((comic_id, chapter_id) => {
                            return $.require("csdown").comic_jx(comic_id, chapter_id);
                        }, id, data.chapter_id),
                        col_type: getItem('pic_col_type', col),
                        extra: {
                            cls: '选集_',
                            comic_id: id,
                            chapter_id: data.chapter_id,
                        }
                    })
                })
            } catch (e) {
                log(e.message)
            }
            d.push({
                col_type: 'blank_block',
                extra: {
                    id: 'blank',
                }
            }, {
                title: '<b><span style="color: #ff847c">推荐</span></b>',
                img: 'http://123.56.105.145/tubiao/messy/9.svg',
                url: $('#noLoading#').lazyRule(() => {
                    refreshPage(false)
                    return 'hiker://empty'
                }),
                col_type: 'text_icon',
                extra: {

                }
            })
            let label = comicinfo.label[0].list;
            label.forEach(data => {
                d.push({
                    title: data.name,
                    img: data.vertical_cover,
                    url: $('hiker://empty?id=' + data.comic_id + '&type=漫画&#immersiveTheme##autoCache#').rule(() => {
                        $.require('csdown').comicerji();
                    }),
                    col_type: 'movie_3',
                    extra: {
                        comic_id: data.comic_id,
                        comic_name: data.name,
                    }
                })
            })
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    comic_more: function() {
        var d = this.d;
        var d_ = this.d_;
        let id = MY_PARAMS.recommend_id;
        let label = MY_PARAMS.label;
        let pg = MY_PAGE;
        if (MY_PAGE == 1) {
            d_.push({
                title: '',
                url: 'hiker://empty',
                col_type: 'rich_text',
            })
            d_.push({
                title: this.strong(label, 'ff6699'),
                url: 'hiker://empty',
                col_type: 'text_center_1',
                extra: {
                    lineVisible: false,
                }
            })
            d_.push({
                img: "http://123.56.105.145/weisyr/img/Loading1.gif",
                url: "hiker://empty",
                col_type: "pic_1_full",
                extra: {
                    id: "loading_"
                }
            });
            setPreResult(d_)
        }
        let recommend = this.post('/ant_read/comic/recommend', JSON.stringify({
            "recommend_id": id,
            "page_num": pg + '',
            "page_size": "20"
        })).list.list;
        recommend.forEach(data => {
            d.push({
                title: data.name,
                desc: '共' + data.total_chapters + '话',
                img: data.vertical_cover,
                url: $('hiker://empty?id=' + data.comic_id + '&type=漫画&#immersiveTheme##autoCache#').rule(() => {
                    $.require('csdown').comicerji();
                }),
                col_type: 'movie_3',
                extra: {
                    comic_id: data.comic_id,
                    comic_name: data.name,
                }
            })
        })
        deleteItem('loading_');
        setResult(d)
    },
    comic_jx: function(comic_id, chapter_id) {
        let image_list = this.post('/ant_read/comic/chapter', JSON.stringify({
            "comic_id": comic_id + '',
            "chapter_id": chapter_id + ''
        })).image_list;
        let img = image_list.map(data => data.img);
        return 'pics://' + img.join('&&');
    },
    isauthor() {
        if ((MY_RULE.author == this.author && MY_RULE.title == this.title) || MY_NAME == '嗅觉浏览器') {} else {
            confirm({
                title: "提示",
                content: '请勿修改作者名称和规则名称，请支持原版！',
                confirm() {
                    MY_RULE.title = "瓜子影视";
                    MY_RULE.author = '流苏';
                    toast("已改回原名，请重新导入");
                    return "rule://" + base64Encode("海阔视界￥home_rule￥" + JSON.stringify(MY_RULE));
                },
                cancel() {
                    return 'toast://请尊重作者劳动成果！';
                },
            });
        }
    }
}
$.exports = csdown
