const csdown = {
    d: [],
    author: '流苏',
    title: '一起刷',
    version: '20260227',
    home: function() {
        let d = this.d;
        if (MY_PAGE == 1) {
            this.init();
            try {
                if (!getItem('up' + this.version, '')) {
                    this.update()
                    setItem('up' + this.version, '1')
                }
            } catch (e) {
                toast('未获取到远程数据，请连接代理后重试')
                log(e.message)
            }
            d.push({   
                title: "搜索 ",
                url: $.toString(() => {
                    putMyVar('keyword', input);
                    return $('hiker://empty?page=fypage').rule(() => {
                        $.require("csdown").search()
                    })
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
                title: this.shouye_id,
                id: '1&2&3&4&5',
                img: this.shouye_img(),
            }];
            let longclick = [{
                title: '更新日志',
                js: $.toString(() => {
                    $.require("csdown").update()
                })
            }]
            this.Cate(首页, '首页', d, 'icon_4', longclick);
            d.push({
                col_type: 'big_blank_block',
            });
        }
        let 分类 = getMyVar('首页', '1');
        if (MY_RULE.author == this.author || MY_NAME == '嗅觉浏览器') {
            if (分类 == 1) {
                this.video()
            } else if (分类 == 2) {
                this.cate()
            } else if (分类 == 3) {
                this.preview()
            } else if (分类 == 4) {
                this.find()
            }
        } else {
            d.push({
                title: '请勿修改作者名',
                url: 'hiker://empty',
                col_type: 'text_center_1'
            })
        }
        setResult(d)
    },
    preview() {
        let d = this.d;
        if (MY_PAGE == 1) {
            let arr = [{
                title: '即将上映&已上映',
                id: '1&2'
            }];
            this.Cate(arr, 'preview_1', d, 'text_2');
        }
        let preview_ = getMyVar('preview_1', '1');
        if (preview_ == 1) {
            let body = {
                "user_id": -1
            };
            if (MY_PAGE > 1) body.next_value = getMyVar('find_next_value_' + MY_PAGE);
            let release = this.post('api/vod/release', body);
            putMyVar('find_next_value_' + (MY_PAGE + 1), release.next_value);
            release.items.forEach(item => {
                d.push({
                    title: item.release_time,
                    col_type: 'rich_text',
                })
                this.list_arr(item.item_list, d)
            })
        } else if (preview_ == 2) {
            if (MY_PAGE == 1) {
                this.top_Cate(storage0.getMyVar('classifylist'), 'his_cate', d);
            }
            let body = {
                "classify_id": Number(getMyVar('his_cate', '0'))
            };
            if (MY_PAGE > 1) body.next_value = getMyVar('his_next_value_' + MY_PAGE);
            let release = this.post('api/vod/release/his', body);
            putMyVar('his_next_value_' + (MY_PAGE + 1), release.next_value);
            release.items.forEach(item => {
                d.push({
                    title: item.release_time,
                    col_type: 'rich_text',
                })
                this.list_arr(item.item_list, d)
            })
        }
    },
    find() {
        let d = this.d;
        if (MY_PAGE == 1) {
            let arr = [{
                title: '追剧&专题&明星',
                id: '1&2&3'
            }];
            this.Cate(arr, 'find', d, 'text_3');
        }
        let find_ = getMyVar('find', '1');
        let photo_domain = getItem('photo_domain');
        if (find_ == '1') {
            let week_1 = new Date().getDay() + '';
            if (MY_PAGE == 1) {
                let week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
                week.forEach((data, index) => {
                    d.push({
                        title: getMyVar('week', week_1) == index ? this.strong((index == week_1 ? '今日' : data), 'ff6699') : (index == week_1 ? '今日' : data),
                        col_type: 'scroll_button',
                        url: $('#noLoading#').lazyRule((data, index) => {
                            putMyVar('week', index + '');
                            refreshPage(false);
                            return 'hiker://empty';
                        }, data, index),
                        extra: {
                            backgroundColor: getMyVar('week', week_1) == index ? "#20FA7298" : "",
                        },
                    });
                });
                d.push({
                    col_type: 'blank_block'
                })
                let filter_arr = [0, 3, 4, 6];
                this.top_Cate(storage0.getMyVar('classifylist').filter((data, index) => filter_arr.includes(index)), 'update_cate', d);
            }
            let list = this.post('api/daily/update/list', {
                "weekday": Number(getMyVar('week', week_1)),
                "page": MY_PAGE,
                "classify_id": Number(getMyVar('update_cate', '0')),
            });
            list.list.forEach(data => {
                d.push({
                    title: data.video_title,
                    desc: data.video_remark + '  ' + data.platform_name + '\n' + data.video_description,
                    img: photo_domain + data.video_cover,
                    url: $('hiker://empty#immersiveTheme#').rule(() => {
                        $.require('csdown').erji();
                    }),
                    col_type: 'movie_1_vertical_pic',
                    extra: {
                        videoid: data.video_id,
                        title: data.video_title,
                        lineVisible: false
                    }
                })
            })
        } else if (find_ == 2) {
            let list = this.post('api/column/list', {
                "page_num": MY_PAGE
            });
            list.list.forEach(item => {
                d.push({
                    title: this.color(item.name),
                    img: 'hiker://images/icon_right5',
                    url: $('hiker://empty?page=fypage').rule(() => {
                        $.require('csdown').column();
                    }),
                    col_type: 'text_icon',
                    extra: {
                        name: item.name,
                        id: item.id,
                    }
                })
                item.subjects.forEach(data => {
                    d.push({
                        title: data.name,
                        desc: `共${data.video_count}部`,
                        img: photo_domain + data.background,
                        url: $('hiker://empty?page=fypage&#gameTheme#').rule(() => {
                            $.require('csdown').subject();
                        }),
                        col_type: 'movie_2',
                        extra: {
                            subjectid: data.subjectid,
                            name: data.name,
                        }
                    })
                })
            })
        } else if (find_ == 3) {
            let list = this.post('api/person/recommend/list', {
                "page_num": MY_PAGE
            });
            list.person_list.forEach(data => {
                d.push({
                    title: data.name + '\n' + ('““””国家：' + data.country).small(),
                    desc: `‘‘共${data.video_count}部’’\n` + data.description,
                    img: photo_domain + data.avatar,
                    url: $('hiker://empty?page=fypage').rule(() => {
                        $.require('csdown').person();
                    }),
                    col_type: 'movie_1_vertical_pic',
                    extra: {
                        name: data.name,
                        person_id: data.person_id,
                        lineVisible: false
                    }
                })
            })
        }
    },
    column() {
        let d = this.d;
        let photo_domain = getItem('photo_domain');
        let list = this.post('api/subject/list', {
            "column_id": Number(MY_PARAMS.id),
            "page_num": MY_PAGE
        });
        if (list.list) {
            list.list.forEach(data => {
                d.push({
                    title: data.name,
                    desc: `共${data.video_count}部`,
                    img: photo_domain + data.background,
                    url: $('hiker://empty?page=fypage&#gameTheme#').rule(() => {
                        $.require('csdown').subject();
                    }),
                    col_type: 'pic_1_card',
                    extra: {
                        subjectid: data.subjectid,
                        name: data.name,
                    }
                })
            })
        }
        setResult(d)
    },
    person() {
        let d = this.d;
        let photo_domain = getItem('photo_domain');
        let list = this.post('api/person/vod/list', {
            "person_id": Number(MY_PARAMS.person_id),
            "page_num": MY_PAGE
        });
        list.video_list.forEach(data => {
            let flags = data.flags.split('/').map(it => {
                return `‘‘’’<b><span style='background-color: #CCCCCC;'><font color=#ffffff>${it}</font></span></b>`;
            });
            let score = `‘‘’’<small><b><span style='background-color: #EBB471;'><font color=#ffffff>♥️ ${data.score}</font></span></b></small>`;
            d.push({
                title: data.title,
                desc: flags + '  ' + score + '\n' + data.introduction,
                img: photo_domain + data.verticalurl,
                url: $('hiker://empty#immersiveTheme#').rule(() => {
                    $.require('csdown').erji();
                }),
                col_type: 'movie_1_vertical_pic',
                extra: {
                    videoid: data.videoid,
                    title: data.title,
                    lineVisible: false
                }
            })
        })
        setResult(d)
    },
    rank() {
        let d = this.d;
        this.top_Cate(storage0.getMyVar('classifylist'), 'rank_cate', d);
        let rank = this.post('api/vod/rank/list', {
            "classify_id": Number(getMyVar('rank_cate', getItem('rank_cate_index')))
        });
        let photo_domain = getItem('photo_domain');
        rank.list.forEach(data => {
            let flags = data.flags.split('/').map(it => {
                return `‘‘’’<b><span style='background-color: #CCCCCC;'><font color=#ffffff>${it}</font></span></b>`;
            });
            let score = `‘‘’’<small><b><span style='background-color: #EBB471;'><font color=#ffffff>♥️ ${data.score}</font></span></b></small>`;
            let remark = `‘‘’’<small><b><span style='background-color: #EBB471;'><font color=#ffffff> ${data.remark}</font></span></b></small>`;
            d.push({
                title: data.title,
                desc: flags + '\n' + score + ' ' + remark,
                img: photo_domain + data.verticalurl,
                url: $('hiker://empty#immersiveTheme#').rule(() => {
                    $.require('csdown').erji();
                }),
                col_type: 'movie_1_vertical_pic',
                extra: {
                    videoid: data.videoid,
                    title: data.title,
                    lineVisible: false
                }
            })
        })
        setResult(d)
    },
    subject() {
        let d = this.d,
            photo_domain = getItem('photo_domain');
        if (MY_PAGE == 1) {
            let info = this.post('api/subject/info', {
                "subject_id": Number(MY_PARAMS.subjectid)
            });
            d.push({
                title: info.name,
                img: photo_domain + info.background,
                url: 'hiker://empty',
                col_type: 'pic_1_full',
                extra: {

                }
            })
            d.push({
                title: this.strong(info.name, 'ff6699'),
                url: 'hiker://empty',
                col_type: 'text_center_1',
                extra: {
                    lineVisible: false,
                }
            })
        }
        let list = this.post('api/vod/search', {
            "subject_id": MY_PARAMS.subjectid + '',
            "page_num": MY_PAGE
        });
        this.list_arr(list.video_list, d);
        setResult(d)
    },
    video() {
        let d = this.d;
        if (MY_PAGE == 1) {
            if (!storage0.getMyVar('classifylist')) {
                let classifylist = this.post('api/index/header', {
                    "ad_type": "1"
                }).classifylist.map(data => {
                    return {
                        name: data.classifyname,
                        id: data.classifyid
                    }
                })
                classifylist.unshift({
                    name: '推荐',
                    id: '0',
                })
                storage0.putMyVar('classifylist', classifylist)
            }
            this.top_Cate(storage0.getMyVar('classifylist'), 'classify_cate', d);
        }
        let classify_cate_ = getMyVar('classify_cate', getItem('classify_cate_index'));
        let classify_cate_index = getItem('classify_cate_index');
        let photo_domain = getItem('photo_domain');
        if (!storage0.getMyVar('video_cache_' + classify_cate_ + MY_PAGE)) {
            let d_ = [];
            if (classify_cate_ == classify_cate_index) {
                let list = this.post('api/index/body');
                list.indexmenulist.forEach(data => {
                    d_.push({
                        title: data.menuname,
                        img: photo_domain + data.menuiconurl,
                        url: data.menuname == '热播排行' ? $('hiker://empty').rule(() => {
                            $.require('csdown').rank();
                        }) : $('hiker://empty?page=fypage&#gameTheme#').rule(() => {
                            $.require('csdown').subject();
                        }),
                        col_type: 'icon_5',
                        extra: {
                            menuid: data.menuid,
                            subjectid: data.actionurl.includes('id=') ? data.actionurl.split('id=')[1] : '',
                            actionurl: data.actionurl
                        }
                    })
                })
                d_.push({
                    title: this.color('热播排行'),
                    img: 'hiker://images/icon_right5',
                    url: $('hiker://empty').rule(() => {
                        $.require('csdown').rank();
                    }),
                    col_type: 'text_icon',
                    extra: {

                    }
                })
                this.list_arr(list.hotvodlist, d_);
                list.subjectlist.forEach(item => {
                    d_.push({
                        title: this.color(item.name),
                        desc: '查看更多+',
                        img: photo_domain + item.background,
                        url: $('hiker://empty?page=fypage&#gameTheme#').rule(() => {
                            $.require('csdown').subject();
                        }),
                        col_type: 'avatar',
                        extra: {
                            subjectid: item.subjectid
                        }
                    })
                    this.list_arr(item.video_list, d_)
                })
            } else {
                let list = this.post('api/classify/view', {
                    "ad_type": "2",
                    "classify_id": Number(classify_cate_),
                });
                let banner = list.focusadlist.filter(c => c.action_url.includes('id=')).map(data => {
                    return {
                        title: data.app_title,
                        img: photo_domain + data.file,
                        url: $('hiker://empty#immersiveTheme#').rule(() => {
                            $.require('csdown').erji();
                        }),
                        extra: {
                            action_url: data.action_url,
                            videoid: data.action_url.includes('id=') ? data.action_url.split('id=')[1] : '',
                            title: data.app_title,
                        }
                    }
                })
                if (banner.length > 0) {
                    this.banner(MY_RULE.title, true, d_, banner, {
                        time: 5000,
                        col_type: 'card_pic_1',
                        desc: '0'
                    })
                }
                list.subjectlist.forEach(item => {
                    d_.push({
                        title: this.color(item.name),
                        desc: '查看更多+',
                        img: photo_domain + item.background,
                        url: $('hiker://empty?page=fypage&#gameTheme#').rule(() => {
                            $.require('csdown').subject();
                        }),
                        col_type: 'avatar',
                        extra: {
                            subjectid: item.subjectid
                        }
                    })
                    this.list_arr(item.video_list, d_)
                })
            }
            storage0.putMyVar('video_cache_' + classify_cate_ + MY_PAGE, d_);
        }
        storage0.getMyVar('video_cache_' + classify_cate_ + MY_PAGE).forEach(data => d.push(data));
    },
    list_arr(list, d) {
        let photo_domain = getItem('photo_domain');
        list.forEach(data => {
            d.push({
                title: data.title,
                desc: data.remark,
                img: photo_domain + data.verticalurl,
                url: $('hiker://empty#immersiveTheme#').rule(() => {
                    $.require('csdown').erji();
                }),
                col_type: 'movie_3',
                extra: {
                    videoid: data.videoid,
                    title: data.title,
                }
            })
        })
        return d
    },
    shouye_id: '首页&筛选&预告&发现',
    shouye_img() {
        let cate_index = getMyVar('首页', '1');
        let id = this.shouye_id.split('&');
        if (!storage0.getMyVar('nav_bottom')) {
            let nav_bottom = this.post('api/nav/bottom').navigation_items.filter(c => id.includes(c.name));
            storage0.putMyVar('nav_bottom', nav_bottom)
        }
        return storage0.getMyVar('nav_bottom').map((data, i) => {
            if (Number(cate_index) == i + 1) return getItem('photo_domain') + data.selected_icon;
            else return getItem('photo_domain') + data.icon;
        }).join('&');
    },
    init() {
        if (!getMyVar('aaa', '')) {
            if (!getItem('uuid', '')) setItem('uuid', this.generateRandomHex(16));
            let host_arr = JSON.parse(base64Decode(JSON.parse(fetch('https://dns.alidns.com/resolve?name=host.movieyqs.com&short=true&type=16&t=' + Math.floor(Date.now())))[0].replace(/"/g, ''))).url.map(c => c + '/');
            for (let it of host_arr) {
                if (request(it + 'ping') == 'pong') {
                    setItem('host', it);
                    log('域名获取：' + it);
                    putMyVar('aaa', '1');
                    break;
                }
            }
            let photo_domain = this.post('api/init', {
                "ad_type": "1",
                "channel_code": "guanfang",
            }).photo_domain[0] + '/';
            setItem('photo_domain', photo_domain);
        }
    },
    color: function(txt) {
        return '<b><font color=' + '#FF6699' + '>' + txt + '</font></b>'
    },
    strong: function(d, c) {
        return '‘‘’’<strong><font color=#' + (c || '000000') + '>' + d + '</font></strong>';
    },
    addressTag: function(url, text) {
        return "<a href='" + url + "'>" + text + "</a>";
    },
    //生成随机uuid
    generateUUID() {
        return 'xxxxxxxx-xxxx-yxxx-xxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    // 随机字符串方法
    generateRandomHex(length) {
        var result = '';
        var characters = '0123456789abcdef';
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
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
        desc = desc.replace(/\n/g, "<br>")

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
        var lazy = $('#noLoading#').b64().lazyRule((dc, sdc, m, cs) => {
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
            img: item.img,
            desc: desc,
            title: item.title,
            url: item.url,
            extra: Object.assign(item.extra, {
                id: id + 'bar'
            })
        })
        if (start == false || getMyVar('benstart', 'true') == 'false') {
            unRegisterTask(id)
            return
        }
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
            if (i > data.length - 1) {
                i = 0
            }
            var item = data[i];
            try {
                updateItem(id + 'bar', {
                    title: item.title,
                    img: item.img,
                    url: item.url,
                    extra: item.extra
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
            title: "2026/02/27",
            records: [
                "‘‘优化’’：优化域名获取",
                "‘‘修复’’：修复部分bug",
            ]
        }, {
            title: "2026/02/23",
            records: [
                "““更新””：增加页面",
            ]
        }]);
    },
    post(url, body, jx) {
        eval(getCryptoJS());
        //解密函数
        function Decrypt(word) {
            const key = CryptoJS.enc.Utf8.parse("0e8c4d7eb462f5c2");
            const iv = CryptoJS.enc.Utf8.parse("de126560f894af37");
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
        }
        // 加密函数
        function Encrypt(plaintext) {
            const key = CryptoJS.enc.Utf8.parse("0e8c4d7eb462f5c2");
            const iv = CryptoJS.enc.Utf8.parse("de126560f894af37");
            var encrypted = CryptoJS.AES.encrypt(plaintext, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            var ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
            return ciphertext;
        }
        url = getItem('host', '') + url;
        let request_id = this.generateUUID();
        let default_body = {
            "device_info": "android",
            "sign": md5(md5(request_id + 'kandianying123') + 'kandianying123'),
            "app_id": "1",
            "uuid": jx ? '216a82d96eb2548b' : getItem('uuid', ''),
            "version": "1.5.2",
            "request_id": request_id
        }
        body = body || {};
        let body_ = JSON.stringify(Object.assign({}, default_body, body));
        let en = fetch(url, {
            headers: {
                'User-Agent': 'okhttp/4.12.0',
            },
            method: 'POST',
            body: body_
        });
        let de = JSON.parse(Decrypt(en)).data;
        return de;
    },
    erji() {
        let d = this.d,
            id = MY_PARAMS.videoid,
            photo_domain = getItem('photo_domain');
        setPageTitle(MY_PARAMS.title);
        addListener('onClose', $.toString((id) => {
            clearMyVar('vodDetail' + id);
            clearMyVar('info');
        }, id));
        try {
            if (!storage0.getMyVar('vodDetail' + id, '')) {
                let data = this.post('api/vod/info', {
                    "video_id": Number(id)
                });
                storage0.putMyVar('vodDetail' + id, data);
            }
            let vod = storage0.getMyVar('vodDetail' + id);
            d.push({
                title: vod.video_name + '\n' + ('‘‘’’演员：' + (vod.actor_list ? vod.actor_list.map(c => c.name).join(' ') : '') + '\n国家：' + vod.area_name).small(),
                desc: '类型：' + (vod.tag_list ? vod.tag_list.map(c => c.tag_name) : '') + '\n' + ('‘‘’’更新状态：' + vod.update_remark + '  ' + vod.year + '  评分：' + vod.score),
                img: photo_domain + vod.vertical_url,
                url: $('hiker://empty?#gameTheme#').rule((pic, name, actor, class_, remarks, area, blurb, year, score) => {
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
                        title: '类型：' + class_,
                        col_type: 'rich_text',
                    }, {
                        title: '更新状态：' + remarks,
                        col_type: 'rich_text',
                    }, {
                        title: '国家：' + area,
                        col_type: 'rich_text',
                    }, {
                        title: '评分：' + score,
                        col_type: 'rich_text',
                    }, {
                        title: '简介：' + blurb,
                        col_type: 'rich_text',
                    }, )
                    setResult(d)
                }, photo_domain + vod.vertical_url, vod.video_name, vod.actor_list ? vod.actor_list.map(c => c.name).join(' ') : '', vod.tag_list ? vod.tag_list.map(c => c.tag_name) : '', vod.update_remark, vod.area_name, vod.introduction, vod.year, vod.score),
                col_type: 'movie_1_vertical_pic_blur',
            })
            this.setDesc(d, vod.introduction);
            let play_list = vod.player_list;
            if (play_list.length > 0) {
                d.push({
                    title: (getMyVar('shsort', '0') == '1') ? '““””<b><span style="color: #FF0000">逆序</span></b>' : '““””<b><span style="color: #1aad19">正序</span></b>',
                    url: $('#noLoading#').lazyRule(() => {
                        return $.require("csdown").shsort();
                    }),
                    col_type: 'scroll_button',
                    extra: {
                        id: '排序',
                    }
                })
                play_list.forEach((data, index_1) => {
                    d.push({
                        title: (getMyVar('info', '0') == index_1 ? this.strong(data.player_name, 'FF6699') : data.player_name),
                        url: $('#noLoading#').lazyRule((n, title, id, vod_id) => {
                            return $.require("csdown").line(n, title, id, vod_id);
                        }, 'info', data.player_name, index_1 + '', id),
                        col_type: 'scroll_button',
                        extra: {
                            longClick: [],
                            backgroundColor: getMyVar('info', '0') == index_1 ? "#20FA7298" : "",
                            id: '线路_' + index_1,
                        }
                    })
                })
                let vod_list = play_list[+getMyVar('info', '0')];
                let urls = vod_list.ep_list;
                let play_line_id = vod_list.play_line_id;
                if (getMyVar('shsort', '0') == '1') {
                    urls.reverse()
                }
                let col = urls.length < 3 || urls[0].ep_name.length > 5 ? 'text_2' : 'text_4';
                urls.forEach(data => {
                    d.push({
                        title: data.ep_name,
                        url: $().lazyRule((id, play_line_id) => {
                            return $.require("csdown").jiexi(id, play_line_id)
                        }, data.ep_id, play_line_id),
                        col_type: col,
                        extra: {
                            id: 'yqs_' + data.ep_id,
                            cls: '选集_',
                        }
                    })
                })
            } else {
                d.push({
                    title: '影片未上架',
                    url: 'hiker://empty',
                    col_type: 'text_center_1',
                    extra: {
                        lineVisible: false
                    }
                })
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
            let recommend_list = this.post('api/vod/guess', {
                "video_id": Number(id)
            });
            this.list_arr(recommend_list.video_list, d);
        } catch (e) {
            log(e.message)
        }
        setResult(d)
    },
    search: function() {
        let d = this.d;
        let photo_domain = getItem('photo_domain');
        if (MY_PAGE == 1) {
            d.push({   
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
        }
        if (getMyVar('keyword', '')) {
            let body = {
                "keyword": getMyVar('keyword', '')
            };
            if (MY_PAGE > 1) body.next_value = getMyVar('search_next_value_' + MY_PAGE);
            let list = this.post('api/search/search', body);
            putMyVar('search_next_value_' + (MY_PAGE + 1), list.next_value);
            list.video_list.forEach(data => {
                let flags = data.flags.split('/').map(it => {
                    return `‘‘’’<b><span style='background-color: #CCCCCC;'><font color=#ffffff>${it}</font></span></b>`;
                });
                let score = `‘‘’’<small><b><span style='background-color: #EBB471;'><font color=#ffffff>♥️ ${data.score}</font></span></b></small>`;
                d.push({
                    title: data.title,
                    desc: flags + '  ' + score + '\n' + data.introduction,
                    img: photo_domain + data.verticalurl,
                    url: $('hiker://empty#immersiveTheme#').rule(() => {
                        $.require('csdown').erji();
                    }),
                    col_type: 'movie_1_vertical_pic',
                    extra: {
                        videoid: data.videoid,
                        title: data.title,
                        lineVisible: false
                    }
                })
            })
        }
        setResult(d)
    },
    cate: function() {
        let d = this.d;
        try {
            if (MY_PAGE == 1) {
                if (!storage0.getMyVar('filter')) {
                    let filter = this.post('api/filter').filters;
                    storage0.putMyVar('filter', filter)
                }
                d.push({
                    title: getMyVar('flod_', '0') == '1' ? '““””<b>' + '∨'.fontcolor("#FF0000") + '</b>' : '““””<b>' + '∧'.fontcolor("#1aad19") + '</b>',
                    url: $('#noLoading#').lazyRule(() => {
                        return $.require("csdown").flod();

                    }),
                    col_type: 'scroll_button',
                    extra: {
                        id: 'flod_1'
                    }
                })
                let classify_id = storage0.getMyVar('filter')[0].filter_tag;
                let classify_name = storage0.getMyVar('filter')[0].filter_param;
                let classify_id_index = classify_id.find(c => c.has_default).id;
                setItem('filter_param_index_' + classify_name, classify_id_index);
                let classify_id_ = getMyVar('filter_param_' + classify_name, getItem('filter_param_index_' + classify_name));
                classify_id.forEach((data, index_1) => {
                    d.push({
                        title: classify_id_ == data.id ? this.strong(data.name, 'FF6699') : data.name,
                        url: $('#noLoading#').lazyRule((classify_name, newid, nowid) => {
                            if (newid != nowid) {
                                putMyVar('filter_param_' + classify_name, newid);
                                refreshPage(false);
                            }
                            return 'hiker://empty';
                        }, classify_name, data.id, classify_id_),
                        col_type: 'scroll_button',
                        extra: {
                            backgroundColor: classify_id_ == data.id ? "#20FA7298" : "",
                        }
                    })
                })
                d.push({
                    col_type: 'blank_block',
                    extra: {
                        id: 'cate_1'
                    }
                })
                if (getMyVar('flod_', '0') == '1') {
                    storage0.getMyVar('filter').slice(1).forEach((item, index) => {
                        let name = item.filter_param;
                        setItem('filter_param_index_' + name, item.filter_tag.find(c => c.has_default).id);
                        let filter_param_ = getMyVar('filter_param_' + name, getItem('filter_param_index_' + name));
                        item.filter_tag.forEach(data => {
                            d.push({
                                title: filter_param_ == data.id ? this.strong(data.name, 'FF6699') : data.name,
                                url: $('#noLoading#').lazyRule((name, newid, nowid) => {
                                    if (newid != nowid) {
                                        putMyVar('filter_param_' + name, newid);
                                        refreshPage(false);
                                    }
                                    return 'hiker://empty';
                                }, name, data.id, filter_param_),
                                col_type: 'scroll_button',
                                extra: {
                                    backgroundColor: filter_param_ == data.id ? "#20FA7298" : "",
                                    cls: '分类_',
                                }
                            })
                        })
                        d.push({
                            col_type: 'blank_block',
                            extra: {
                                cls: '分类_'
                            }
                        })
                    })
                }
            }
            let body = {
                "page_num": MY_PAGE
            };
            let names = storage0.getMyVar('filter').map(c => c.filter_param);
            names.forEach(name => {
                let filter_param_index = getItem('filter_param_index_' + name);
                let filter_param_ = getMyVar('filter_param_' + name, filter_param_index);
                if (filter_param_) body[name] = filter_param_;
            })
            let list = this.post('api/vod/search', body);
            this.list_arr(list.video_list, d);
        } catch (e) {
            log(e.message)
        }
    },
    jiexi: function(id, play_line_id) {
        try {
            let play_url = this.post('api/vod/play_url', {
                "play_line_id": Number(play_line_id),
                "ep_id": Number(id),
                "resolution": "hd"
            }, true).play_url;
            return play_url
        } catch (e) {
            log(e.message)
            return 'toast://未获取到链接'
        }
    },
    shsort: function() {
        let shsort = getMyVar('shsort', '0');
        putMyVar('shsort', shsort == '1' ? '0' : '1');
        shsort = getMyVar('shsort', '0');
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
    line: function(n, title, id, vod_id) {
        putMyVar(n, id);
        try {
            let play_list = storage0.getMyVar('vodDetail' + vod_id).player_list;
            let vod_info = getMyVar('info', '0');
            play_list.forEach((data, index_1) => {
                updateItem('线路_' + index_1, {
                    title: (vod_info == index_1 ? this.strong(data.player_name, 'FF6699') : data.player_name),
                    extra: {
                        longClick: [],
                        backgroundColor: vod_info == index_1 ? "#20FA7298" : "",
                        id: '线路_' + index_1,
                    }
                })
            })
            let vod_list = play_list[+getMyVar('info', '0')];
            let urls = vod_list.ep_list;
            let play_line_id = vod_list.play_line_id;
            if (getMyVar('shsort', '0') == '1') {
                urls.reverse()
            }
            let col = urls.length < 3 || urls[0].ep_name.length > 5 ? 'text_2' : 'text_4';
            let line = urls.map(data => {
                return {
                    title: data.ep_name,
                    url: $().lazyRule((id, play_line_id) => {
                        return $.require("csdown").jiexi(id, play_line_id)
                    }, data.ep_id, play_line_id),
                    col_type: col,
                    extra: {
                        id: 'yqs_' + data.ep_id,
                        cls: '选集_',
                    }
                }
            })
            deleteItemByCls('选集_');
            addItemBefore('blank', line);
        } catch (e) {
            log(e.message)
            refreshPage(false)
        }
        return 'hiker://empty';
    },
    flod: function() {
        putMyVar('flod_', getMyVar('flod_', '0') === '1' ? '0' : '1');
        updateItem('flod_1', {
            title: getMyVar('flod_', '0') == '1' ? '““””<b>' + '∨'.fontcolor("#FF0000") + '</b>' : '““””<b>' + '∧'.fontcolor("#1aad19") + '</b>',
        })
        if (getMyVar('flod_', '0') == '1') {
            let flod = [];
            storage0.getMyVar('filter').slice(1).forEach((item, index) => {
                let name = item.filter_param;
                setItem('filter_param_index_' + name, item.filter_tag.find(c => c.has_default).id);
                let filter_param_ = getMyVar('filter_param_' + name, getItem('filter_param_index_' + name));
                item.filter_tag.forEach(data => {
                    flod.push({
                        title: filter_param_ == data.id ? this.strong(data.name, 'FF6699') : data.name,
                        url: $('#noLoading#').lazyRule((name, newid, nowid) => {
                            if (newid != nowid) {
                                putMyVar('filter_param_' + name, newid);
                                refreshPage(false);
                            }
                            return 'hiker://empty';
                        }, name, data.id, filter_param_),
                        col_type: 'scroll_button',
                        extra: {
                            backgroundColor: filter_param_ == data.id ? "#20FA7298" : "",
                            cls: '分类_',
                        }
                    })
                })
                flod.push({
                    col_type: 'blank_block',
                    extra: {
                        cls: '分类_'
                    }
                })
            })
            addItemAfter('cate_1', flod)
        } else {
            deleteItemByCls('分类_')
        }
        return 'hiker://empty'
    },
}
$.exports = csdown
