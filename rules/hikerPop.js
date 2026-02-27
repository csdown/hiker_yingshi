// author@LoyDgIk
// 该插件仅供娱乐，是作者学习研究代码的副产物，插件可能纯在一些漏洞与不合理的设计，请谨慎用于实际项目。
// 已知问题，用弹窗播放视频链接，不会有播放记录。进入子页面有历史记录，但没有足迹。
//引入Java类
const XPopup = com.lxj.xpopup.XPopup;
const XPopupUtils = com.lxj.xpopup.util.XPopupUtils
const XPopupCallback = com.lxj.xpopup.interfaces.XPopupCallback;
const DetailUIHelper = com.example.hikerview.ui.detail.DetailUIHelper;
const DisplayUtil = com.example.hikerview.utils.DisplayUtil;
const ActivityManager = com.example.hikerview.ui.ActivityManager;
const R = com.example.hikerview.R;
const Integer = java.lang.Integer;
const ArrayList = java.util.ArrayList;
const Runnable = java.lang.Runnable;
const Bookmark = com.example.hikerview.model.Bookmark;

let BookmarkFolderPopup = com.example.hikerview.ui.home.view.BookmarkFolderPopup;
let IconAdapter = com.example.hikerview.ui.home.view.BookmarkFolderAdapter;

const InputPopup = com.example.hikerview.ui.view.popup.InputPopup
const ConfirmPopup = com.example.hikerview.ui.view.popup.ConfirmPopup;

const SettingMenuPopup = com.example.hikerview.ui.setting.SettingMenuPopup;
const OfficeItem = com.example.hikerview.ui.setting.office.OfficeItem;
const CustomBottomRecyclerViewPopup = com.example.hikerview.ui.view.CustomBottomRecyclerViewPopup;
const CustomCenterRecyclerViewPopup = com.example.hikerview.ui.view.CustomCenterRecyclerViewPopup;
const CustomRecyclerViewPopup = com.example.hikerview.ui.view.CustomRecyclerViewPopup;
const FileDetailPopup = com.example.hikerview.ui.setting.file.FileDetailPopup;
const CustomCopyPopup = com.example.hikerview.ui.view.CustomCopyPopup;
const CustomColorPopup = com.example.hikerview.ui.view.CustomColorPopup;
const Class = java.lang.Class;
const AutoImportHelper = com.example.hikerview.utils.AutoImportHelper;
const PageParser = com.example.hikerview.service.parser.PageParser;

const UrlDetector = com.example.hikerview.ui.browser.model.UrlDetector;
const PlayerChooser = com.example.hikerview.ui.video.PlayerChooser;
const VideoChapter = com.example.hikerview.ui.video.VideoChapter;
const FJSON = com.alibaba.fastjson.JSON;

const ToastMgr = com.example.hikerview.utils.ToastMgr;
const ChefSnackbar = com.example.hikerview.ui.view.toast.ChefSnackbar;
const ThreadTool = com.example.hikerview.utils.ThreadTool;
const AlertDialog = Packages.androidx.appcompat.app.AlertDialog;
const DialogUtil = com.example.hikerview.utils.view.DialogUtil;
const HeavyTaskUtil = com.example.hikerview.utils.HeavyTaskUtil;

const GridLayoutManager = Packages.androidx.recyclerview.widget.GridLayoutManager;
const LinearLayout = android.widget.LinearLayout;
const ItemTouchHelper = Packages.androidx.recyclerview.widget.ItemTouchHelper;


const BiometricManager = Packages.androidx.biometric.BiometricManager;
const BiometricPrompt = Packages.androidx.biometric.BiometricPrompt;
const ContextCompat = Packages.androidx.core.content.ContextCompat;
const Build = android.os.Build;
let JSContext = org.mozilla.javascript.Context;
let JSContextVer = JSContext.getCurrentContext().getLanguageVersion();
const RecyclerView = Packages.androidx.recyclerview.widget.RecyclerView;
const LayoutInflater = android.view.LayoutInflater;
const TextViewUtils = com.example.hikerview.ui.view.util.TextViewUtils;
const View = android.view.View;
const EventBus = org.greenrobot.eventbus.EventBus;


if (typeof MY_RULE === "undefined") {
	MY_RULE = null;
}
if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
	throw Error("hikerPop只能在android8.0及以上运行");
}
//适配嗅觉浏览器
let cannotTouchUI = false;
if (typeof MY_NAME !== "undefined" && MY_NAME === "嗅觉浏览器") {
	cannotTouchUI = true;
	BookmarkFolderPopup = com.example.hikerview.ui.bookmark.BookmarkFolderPopup;
	IconAdapter = com.example.hikerview.ui.bookmark.BookmarkFolderAdapter;
}

function getContext() {
	return typeof getCurrentActivity === "function" ? getCurrentActivity() : ActivityManager.getInstance().getCurrentActivity();
}
//获取上下文
const startActivity = getContext();

let useStartActivity = true;

function getArticleListFragment(activity) {
	//let activity = getCurrentActivity();	
	try {
		if (activity instanceof com.example.hikerview.ui.home.MainActivity) {
			let MainActivity = activity.getClass();
			let field = MainActivity.getDeclaredField("viewPagerAdapter");
			field.setAccessible(true);
			let viewPagerAdapter = field.get(activity);
			let articleListFragment = viewPagerAdapter.getClass().getMethod("getCurrentFragment").invoke(viewPagerAdapter);
			return articleListFragment || null;
		} else if (activity instanceof com.example.hikerview.ui.home.FilmListActivity) {
			let FilmListActivity = activity.getClass();
			let field = FilmListActivity.getDeclaredField("articleListFragment");
			field.setAccessible(true);
			let articleListFragment = field.get(activity);
			return articleListFragment;
		} else {
			return null;
		}
	} catch (e) {
		return null;
	}
}
const currentArticleListFragment = getArticleListFragment(startActivity);

function clickItem(af, position, url) {
	let click = af.getClass().getDeclaredMethod("clickItem", android.view.View, java.lang.Integer.TYPE, java.lang.String, java.lang.Boolean.TYPE, java.lang.String);
	click.setAccessible(true);
	click.invoke(af, null, java.lang.Integer.valueOf(position), url, true, "");
}

function canTouchUI(name, time) {
	let canTouch = javaContext.getClass().getDeclaredMethod("canTouchUI", java.lang.String, java.lang.String, java.lang.Long.TYPE);
	canTouch.setAccessible(true);
	time = Number(time);
	let res = canTouch.invoke(javaContext, MY_RULE ? MY_RULE.title : "hikerPop", name, java.lang.Long.valueOf(Number.isNaN(time) ? 200 : time));
	return res == true;
}

function getActivityContext() {
	return useStartActivity ? startActivity : getContext();
}

function setUseStartActivity(bool) {
	useStartActivity = !!bool;
	return this;
}
let throttleTime = 0;

function setNextThrottle(time) {
	if (time == void 0) {
		throttleTime = 200;
	} else if (typeof time === "number" && time > 0) {
		throttleTime = time;
	}
	return this;
}

function newSimpleCallback({
	beforeDismiss,
	beforeShow,
	onBackPressed,
	onCreated,
	onDismiss,
	onDrag,
	onKeyBoardStateChanged,
	onShow
}) {
	return new XPopupCallback({
		beforeDismiss(basePopupView) {
			tryCallBack(beforeDismiss, [basePopupView], true);
		},
		beforeShow(basePopupView) {
			tryCallBack(beforeShow, [basePopupView], true);
		},
		onBackPressed(basePopupView) {
			if (typeof onBackPressed === "function") {
				return !!tryCallBack(onBackPressed, [basePopupView], true);
			} else {
				return false;
			}
		},
		onCreated(basePopupView) {
			tryCallBack(onCreated, [basePopupView], true);
		},
		onDismiss(basePopupView) {
			tryCallBack(onDismiss, [basePopupView], true);
		},
		onDrag(basePopupView, value, percent, upOrLeft) {
			tryCallBack(onDrag, [basePopupView, value, percent, upOrLeft], true);
		},
		onKeyBoardStateChanged(basePopupView, height) {
			tryCallBack(onKeyBoardStateChanged, [basePopupView, height], true);
		},
		onShow(basePopupView) {
			tryCallBack(onKeyBoardStateChanged, [basePopupView], true);
		}
	});
}

function getVideoChapter(playList) {
	let videoChapterClass = new VideoChapter().getClass();
	return FJSON.parseArray(JSON.stringify(playList), videoChapterClass);
}

function playVideos(playList, pos) {
	if (!Array.isArray(playList)) {
		if ($.type(playList) === "object") {
			playList = [playList];
		} else {
			return false;
		}
	}

	let videoChapter = getVideoChapter(playList);
	if (pos !== void 0 && pos >= 0 && pos < videoChapter.size()) {
		videoChapter.get(pos).setUse(true);
	}
	PlayerChooser.startPlayer(getActivityContext(), videoChapter);
	return true;
}

function toNextPage(url) {
	try {
		let rule = getParam("rule", "", url);
		if (!rule && MY_RULE) {
			url = buildUrl(url, {
				rule: MY_RULE.title
			});
		}
		if (Object.keys(AutoImportHelper).includes("lambda$couldCloudImport$2")) {
			AutoImportHelper.lambda$couldCloudImport$2(url);
		} else {
			let autoImportHelperClass = new AutoImportHelper().getClass();
			let couldCloudImportMethod = autoImportHelperClass.getDeclaredMethod("lambda$couldCloudImport$2", Class.forName("java.lang.String"));
			couldCloudImportMethod.setAccessible(true);
			couldCloudImportMethod.invoke(null, url);
		}
	} catch (e) {
		toast(e.toString());
	}
}

function toPalyPage(url, title) {
	try {
		PlayerChooser.startPlayer(getActivityContext(), title || url, url);
	} catch (e) {
		toast(e.toString());
	}
}

function throwError(e) {
	let message = "",
		lineNumber = -1;
	if (e instanceof Error) {
		message = e.message;
		lineNumber = e.lineNumber;
	} else {
		message = String(e);
	}
	log(message);
	setError("\n行数：" + lineNumber + "\n详情：" + message);
}

function tryNewCallBack(callBack, args, noDeal) {
	HeavyTaskUtil.executeNewTask(new Runnable({
		run() {
			try {
				checkJsVer();
				if (callBack == null) {
					return;
				}
				args = args || [];
				let res = callBack.apply(null, args);
				if (noDeal) return;
				dealUrlSimply(res, args[0]);
			} catch (e) {
				throwError(e);
			}
		}
	}));
}

function runOnNewThread(func) {
	tryNewCallBack(func);
}

function tryCallBack(callBack, args, noDeal) {
	try {
		checkJsVer();
		if (callBack == null) {
			return;
		}
		args = args || [];
		let res = callBack.apply(null, args);
		//log(res)
		if (noDeal) return res;

		dealUrlSimply(res, args[0]);
	} catch (e) {
		throwError(e);
	}
}

function dealUrlSimply(url, title) {
	if (typeof url !== "string" || !url) return;
	if (currentArticleListFragment && typeof MY_POSITION !== "undefined" && MY_POSITION > -1) {
		clickItem(currentArticleListFragment, MY_POSITION, url);
	} else {
		simpleRoute(url, title);
	}
}

function simpleRoute(url, title) {
	if (PageParser.isPageUrl(url)) {
		return toNextPage(url);
	} else if (!DetailUIHelper.dealUrlSimply(getActivityContext(), null, MY_RULE, null, url || "", null, null) && UrlDetector.isVideoOrMusic(url)) {
		return toPalyPage(url, typeof title === "string" ? title : url);
	}
}

function checkJsVer() {
	let cx = JSContext.getCurrentContext();
	if (!cx.getLanguageVersion()) {
		try {

		} catch (e) {
			log(e.toString())
		}
		cx.setLanguageVersion(JSContextVer);
	}
}

function getDefaultValue(v, type, defaultValue) {
	if ($.type(v) !== type) return defaultValue;
	return v || defaultValue;
}

function getNumberValue(v, func, defaultValue) {
	if (!($.type(v) === "number" || func(v))) return defaultValue;
	return v;
}

function getStringArray(arr, defaultValue) {
	if ($.type(arr) !== "array") return defaultValue;
	return arr.map(v => String(v));
}

function checkStringArray(arr) {
	arr.forEach((v, i) => arr[i] = String(v));
}

function getNumberArray(arr, defaultValue) {
	if ($.type(arr) !== "array") return defaultValue;
	return arr.map(v => Number(v) || 0);
}

function getBookList(arr) {
	let list = new ArrayList();
	for (let it of arr) {
		let bookmark = new Bookmark();
		bookmark.setTitle(it.title || "");
		bookmark.setDir(false);
		bookmark.setUrl(it.url || it.title || "");
		bookmark.setIcon(it.icon || "");
		list.add(bookmark);
	}
	return list;
}

function builderXPopup(context) {
	return new XPopup.Builder(context || getActivityContext())
		.borderRadius(DisplayUtil.dpToPx(getActivityContext(), 16));
}

function dpToPx(dp) {
	return DisplayUtil.dpToPx(getActivityContext(), dp);
}

function runOnUI(func) {
	ThreadTool.INSTANCE.runOnUI(new Runnable({
		run() {
			checkJsVer();
			try {
				func();
			} catch (e) {
				throwError(e);
			}
		}
	}));
}

const showOnUI = cannotTouchUI ? pop => runOnUI(() => pop.show()) : pop => pop.show();

function isDarkMode() {
	const Configuration = android.content.res.Configuration;
	let cx = getCurrentActivity();

	let theme = cx.getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
	return theme == Configuration.UI_MODE_NIGHT_YES;

}

function FlexSectionButton(button) {
	if (typeof button === "object" && !(button instanceof java.lang.String)) {
		this.title = button.button;
		this.extra = button.extra;
	} else {
		this.title = String(button);
	}
}

function FlexSection(title, buttons, desc, getBackgroundColor) {
	this.title = title;
	this.buttons = Array.isArray(buttons) ? buttons.map((v, i) => new FlexSectionButton(v)) : [];
	this.desc = desc;
	this.getBackgroundColorFunc = getDefaultValue(getBackgroundColor, "function", null);
	this.hasBackgroundColor = !!getBackgroundColor;

}
Object.assign(FlexSection.prototype, {
	getSectionTitle() {

		return String(this.title || "")
	},
	getButtons() {

		return this.buttons;
	},
	getSectionDesc() {
		return String(this.desc || "")
	},
	getBackgroundColor(i, button) {
		return tryCallBack(this.getBackgroundColorFunc, [i, this.buttons[i]], true);
	},
	setSectionTitle(title) {
		this.title = title;
		return this;
	},
	updateButtonTitle(index, title) {
		let button = this.buttons.at(index);
		button && (button.title = title);

		return this;
	},
	removeButton(index) {
		this.buttons.splice(index, 1);
		return this;
	}

});

function FlexMenuBottom({
	sections,
	title,
	click,
	longClick,
	height,
	extraInputBox
}) {

	function newClickListener(value, index, index2) {
		return {
			onLongClick() {
				tryCallBack(getDefaultValue(longClick, "function", null), [value, index, index2]);
			},
			click() {
				tryCallBack(getDefaultValue(click, "function", null), [value, index, index2]);
			}
		};
	}
	height = getNumberValue(height, v => v <= 1 && v > 0, 0.75);
	let sectionsq = Array.isArray(sections) ? sections.filter(v => v instanceof FlexSection) : [];
	let mainTitle = getDefaultValue(title, "string", null);
	let complexMenuPopup = new JavaAdapter(com.lxj.xpopup.core.BottomPopupView, {

		getImplLayoutId() {
			return isDarkMode() ? R.layout.pop_custom_center_recycler_view_dark :
				R.layout.pop_custom_center_recycler_view;
		},
		getPopupHeight() {
			try {
				return XPopupUtils.getScreenHeight(getActivityContext()) * height;
			} catch (e) {
				log(e.toString())
				return this.super$getPopupHeight();
			}
		},
		onCreate() {
			this.super$onCreate();
			let titleView = this.findViewById(R.id.title);
			titleView.setText(String(mainTitle));

			this.titleView = titleView;
			// 配置RecyclerView
			this.recyclerView = this.findViewById(R.id.recyclerView);
			//Packages.androidx.core.view.ViewCompat.setBackground(this.recyclerView, Packages.androidx.core.content.ContextCompat.getDrawable(getActivityContext(), R.drawable.bg_round_all_rice));
			this.recyclerView.setLayoutManager(new GridLayoutManager(getContext(), 1));

			try {
				this.adapter = newSectionAdapter(getActivityContext(), sectionsq, newClickListener);
				this.recyclerView.setAdapter(this.adapter);

				let linearLayout = this.recyclerView.getParent();
				if (linearLayout && extraInputBox instanceof ResExtraInputBox) {
					let inputItem = extraInputBox.create(linearLayout, [this]);
					let params = inputItem.getLayoutParams();
					params.setMargins(35, 0, 35, 0);
					inputItem.setLayoutParams(params);
					linearLayout.addView(inputItem, 1);
				}
			} catch (e) {

			}
		},
		setTitle(title) {
			if (this.titleView) {
				this.titleView.setText(String(title));
			}
		},
		removeSection(index) {
			if (index >= 0 && index < sectionsq.length) {
				sectionsq.splice(index, 1);
				if (this.adapter != null) {
					// 计算RecyclerView位置 (每个section占2个位置)
					let startPosition = index * 2;
					this.adapter.notifyItemRangeRemoved(startPosition, 2);
					this.adapter.notifyItemRangeChanged(startPosition, this.adapter.getItemCount() - startPosition);
				}
			}
		},
		updateSectionTitle(index, newTitle) {
			if (index >= 0 && index < sectionsq.length) {
				sectionsq.at(index).setSectionTitle(newTitle);
				if (this.adapter != null) {
					// 标题位置 = index * 2
					this.adapter.notifyItemChanged(index * 2);
				}
			}
		},
		updateButtonTitle(sectionIndex, buttonIndex, newTitle) {
			if (sectionIndex >= 0 && sectionIndex < sectionsq.length) {
				sectionsq.at(sectionIndex).updateButtonTitle(buttonIndex, newTitle);
				if (this.adapter != null) {
					// 按钮组位置 = sectionIndex * 2 + 1
					this.adapter.notifyItemChanged(sectionIndex * 2 + 1);
				}
			}
		},
		removeButton(sectionIndex, buttonIndex) {
			if (sectionIndex >= 0 && sectionIndex < sectionsq.length) {
				sectionsq.at(sectionIndex).removeButton(buttonIndex);
				if (this.adapter != null) {
					// 按钮组位置 = sectionIndex * 2 + 1
					this.adapter.notifyItemChanged(sectionIndex * 2 + 1);
				}
			}
		},
		addSection(index, section) {
			index = index === null ? sectionsq.length : index;
			if (index >= 0 && index <= sectionsq.length && section instanceof FlexSection) {
				sectionsq.splice(index, 0, section);
				if (this.adapter != null) {
					let startPosition = index * 2;
					this.adapter.notifyItemRangeInserted(startPosition, 2);

				}
			}

		},
		addButton(sectionIndex, buttonIndex, button) {
			sectionIndex = sectionIndex === null ? sectionsq.length - 1 : sectionIndex;

			if (sectionIndex >= 0 && sectionIndex < sectionsq.length) {
				let section = sectionsq.at(sectionIndex);
				buttonIndex = buttonIndex === null ? section.getButtons().length : buttonIndex;

				section.getButtons().splice(buttonIndex, 0, new FlexSectionButton(button));
				if (this.adapter != null) {
					// 按钮组位置 = sectionIndex * 2 + 1
					this.adapter.notifyItemChanged(sectionIndex * 2 + 1);
				}
			}
		}
	}, getActivityContext());
	let pop = new builderXPopup().moveUpToKeyboard(false).asCustom(complexMenuPopup);
	showOnUI(pop);
	return pop;
}
FlexMenuBottom.FlexSection = FlexSection;

function newSectionAdapter(context, sections, newClickListener) {

	function newSectionViewHolder(itemView, type) {
		try {
			if (type == 0) {

				let title = itemView.findViewById(R.id.movie_one_title);
				let desc = itemView.findViewById(R.id.movie_one_desc);
				let resultBg = itemView.findViewById(R.id.result_bg);
				return new JavaAdapter(RecyclerView.ViewHolder, {
					getType() {
						return type;
					},
					getTitleView() {
						return title;
					},
					getDescView() {
						return desc;
					},
					getResultBg() {
						return resultBg;
					}
				}, itemView);

			} else if (type == 1) {

				let flexboxLayout = itemView.findViewById(R.id.flexboxLayout);
				return new JavaAdapter(RecyclerView.ViewHolder, {

					getType() {
						return type;
					},
					getFlexboxLayout() {
						return flexboxLayout;
					}
				}, itemView);
			}
		} catch (e) {
			return null;
		}
	}
	let sectionAdapter = new JavaAdapter(RecyclerView.Adapter, {

		onCreateViewHolder(parent, viewType) {
			return newSectionViewHolder(LayoutInflater.from(context)
				.inflate(viewType == 1 ? R.layout.item_flex_box : R.layout.item_movie_one_col_nopic, parent, false), viewType)
		},
		getItemCount() {
			return sections.length * 2;
		},
		getItemViewType(position) {
			// 偶数位置是标题，奇数位置是按钮组
			return position % 2 == 0 ? 0 : 1;
		},
		onBindViewHolder(holder, position) {
			// 计算当前所在的Section索引
			let sectionIndex = Math.floor(position / 2);
			let section = sections.at(sectionIndex);
			if (!(section instanceof FlexSection)) {
				return;
			}
			let type = holder.getType();
			if (type == 0) {

				let titleView = holder.getTitleView();
				let descView = holder.getDescView();
				titleView.setTextColor(context.getResources().getColor(R.color.blackText));

				TextViewUtils.setSpanText(titleView, section.getSectionTitle());
				if (section.getSectionDesc()) {
					descView.setVisibility(0);
					TextViewUtils.setSpanText(descView, section.getSectionDesc());
				} else {
					descView.setVisibility(8);
				}
				holder.getResultBg().setBackground(context.getResources().getDrawable(R.drawable.ripple_trans2));

			} else if (type == 1) {

				// 清除现有按钮
				let flexboxLayout = holder.getFlexboxLayout();
				flexboxLayout.removeAllViews();

				// 添加新按钮
				let dpToPx = DisplayUtil.dpToPx(context, 2);
				let i = 0;
				for (let button of section.getButtons()) {
					if (!(button instanceof FlexSectionButton)) continue;
					let buttonText = button.title;
					let buttonView = LayoutInflater.from(context).inflate(R.layout.item_article_flex_btn_item, null);
					let layoutParams = new LinearLayout.LayoutParams(new LinearLayout.LayoutParams(-2, -2));

					layoutParams.setMargins(dpToPx, 0, dpToPx, 0);
					buttonView.setLayoutParams(layoutParams);
					let textView = buttonView.findViewById(R.id.item_chapter_jishu);
					TextViewUtils.setSpanText(textView, buttonText);
					try {
						let backgroundColor;
						if (section.hasBackgroundColor && (backgroundColor = section.getBackgroundColor(i))) {
							let parseColor = android.graphics.Color.parseColor(backgroundColor);
							let gradientDrawable = new android.graphics.drawable.GradientDrawable();
							gradientDrawable.setShape(0);
							gradientDrawable.setCornerRadius(DisplayUtil.dpToPx(context, 8));
							gradientDrawable.setColor(parseColor);
							textView.setBackground(new android.graphics.drawable.RippleDrawable(context.getResources().getColorStateList(R.color.grey_black), gradientDrawable, null));
						} else {

							textView.setBackground(context.getResources().getDrawable(R.drawable.ripple_gray_corners));
						}
					} catch (e) {
						log(e.toString());
						textView.setBackground(context.getResources().getDrawable(R.drawable.ripple_gray_corners));
					}
					let clickListener = newClickListener(button, sectionIndex, i);

					buttonView.setOnLongClickListener(new View.OnLongClickListener({
						onLongClick(v) {
							clickListener.onLongClick();
							return true;
						},
						onLongClickUseDefaultHapticFeedback(v) {
							return false;
						}
					}));

					buttonView.setOnClickListener((v) => {
						clickListener.click();
					});
					flexboxLayout.addView(buttonView);
					i++;
				}
			}
		}
	});
	return sectionAdapter;
}

function collectBottom({
	list,
	title,
	click,
	longClick,
	tagClick,
	height,
	extraInputBox
}) {
	const XGridLayoutManager = com.example.hikerview.ui.view.XGridLayoutManager;

	function newClickListener() {
		return {
			onLongClick(i) {
				tryCallBack(getDefaultValue(longClick, "function", null), [list.at(i), i]);
			},
			click(i) {
				tryCallBack(getDefaultValue(click, "function", null), [list.at(i), i]);
			},
			tagClick(i) {
				tryCallBack(getDefaultValue(click, "function", null), [list.at(i), i]);
			}
		};
	}
	list = Array.isArray(list) ? list.filter(v => typeof v === "object") : [],
		height = getNumberValue(height, v => v <= 1 && v > 0, 0.75);
	let mainTitle = getDefaultValue(title, "string", null);
	let complexMenuPopup = new JavaAdapter(com.lxj.xpopup.core.BottomPopupView, {
		getImplLayoutId() {
			return isDarkMode() ? R.layout.pop_custom_center_recycler_view_dark :
				R.layout.pop_custom_center_recycler_view;
		},
		getPopupHeight() {
			try {
				return XPopupUtils.getScreenHeight(getActivityContext()) * height;
			} catch (e) {
				log(e.toString())
				return this.super$getPopupHeight();
			}
		},
		onCreate() {
			this.super$onCreate();
			let titleView = this.findViewById(R.id.title);

			titleView.setText(String(mainTitle));

			this.titleView = titleView;
			// 配置RecyclerView
			this.recyclerView = this.findViewById(R.id.recyclerView);
			//Packages.androidx.core.view.ViewCompat.setBackground(this.recyclerView, Packages.androidx.core.content.ContextCompat.getDrawable(getActivityContext(), R.drawable.bg_round_all_rice));
			this.recyclerView.setBackgroundResource(R.drawable.bg_round_all_rice);
			let glm = new XGridLayoutManager(getContext(), 1);
			//glm.setSpanSizeLookup()
			this.recyclerView.setLayoutManager(glm);
			// Java
			let paddingStartEnd = DisplayUtil.dpToPx(getActivityContext(), 4);
			let paddingTopBottom = DisplayUtil.dpToPx(getActivityContext(), 6);
			this.recyclerView.setPadding(paddingStartEnd, paddingTopBottom, paddingStartEnd, paddingTopBottom);
			try {
				this.adapter = newCollecListAdapter(getActivityContext(), list, newClickListener());
				this.recyclerView.setAdapter(this.adapter);
				this.recyclerView.addItemDecoration(this.adapter.getDividerItem());
				let linearLayout = this.recyclerView.getParent();
				if (linearLayout && extraInputBox instanceof ResExtraInputBox) {
					let inputItem = extraInputBox.create(linearLayout, [this]);
					let params = inputItem.getLayoutParams();
					params.setMargins(35, 0, 35, 0);
					inputItem.setLayoutParams(params);
					linearLayout.addView(inputItem, 1);
				}
			} catch (e) {

			}
		}
	}, getActivityContext());
	let pop = new builderXPopup().moveUpToKeyboard(false).asCustom(complexMenuPopup);
	showOnUI(pop);
	return pop;
}

function newCollecListAdapter(context, list, clickListener, _useGrid) {
	const CollectionListAdapter = com.example.hikerview.ui.setting.CollectionListAdapter;
	const picType = 1,
		noPicType = 2,
		gridType = 3;
	let useGrid = _useGrid || false;
	const Glide = com.bumptech.glide.Glide;
	const GlideUtil = com.example.hikerview.utils.GlideUtil;
	const options = new com.bumptech.glide.request.RequestOptions();
	//let RuleHolderClass=CollectionListAdapter.RuleHolder.__javaObject__;
	function invokeGet(obj, key) {
		return obj.getClass().getMethod(key).invoke(obj);
	}
	return new JavaAdapter(RecyclerView.Adapter, {
		getItemCount() {
			return list.length;
		},

		onCreateViewHolder(viewGroup, viewType) {
			let inflate;
			switch (viewType) {
				case picType:
					inflate = LayoutInflater.from(context).inflate(2131558583, viewGroup, false);
					return new CollectionListAdapter.RuleHolder(inflate);
				case gridType:
					inflate = LayoutInflater.from(context).inflate(2131558584, viewGroup, false);
					return new CollectionListAdapter.GridHolder(inflate);
				default:

					inflate = LayoutInflater.from(context).inflate(2131558584, viewGroup, false);
					return new CollectionListAdapter.RuleHolder(inflate);
			}
		},
		setUseGrid(_useGrid) {
			useGrid = _useGrid;
		},
		getUseGrid() {
			return useGrid;
		},
		getItemViewType(position) {
			let item = list.at(position);
			if (useGrid) {
				return gridType
			}
			if (item.pic_url && item.pic_url.startsWith("http")) {
				return picType;
			}
			return noPicType;
		},
		onBindViewHolder(viewHolder, position) {
			let viewCollection = list.at(position);
			if (typeof viewCollection !== "object") viewCollection = {};

			if (viewHolder instanceof CollectionListAdapter.RuleHolder) {
				try {
					let ruleHolder = viewHolder;
					invokeGet(ruleHolder, "getTitle").setText(viewCollection.title || null);

					let picUrl = String(viewCollection.pic_url);

					if (picUrl && picUrl.startsWith("http")) {
						invokeGet(ruleHolder, "getItem_result_img_bg").setVisibility(0);
						Glide.with(context).load(GlideUtil.getGlideUrl(viewCollection.url || picUrl || null, picUrl)).apply(options).into(invokeGet(ruleHolder, "getItem_reult_img"));
						invokeGet(ruleHolder, "getItem_url").setText(viewCollection.desc || null);

					} else {
						invokeGet(ruleHolder, "getItem_result_img_bg").setVisibility(8);

					}

					if (viewCollection.tag) {
						let itemVideo = invokeGet(ruleHolder, "getItem_video");
						itemVideo.setText(String(viewCollection.tag));
						itemVideo.setBackgroundColor(context.getResources().getColor(2131100420));
						itemVideo.setTextColor(context.getResources().getColor(2131100488));
						invokeGet(ruleHolder, "getItem_video_card").setVisibility(0);
					} else {
						invokeGet(ruleHolder, "getItem_video_card").setVisibility(8);
					}

					if (viewCollection.info) {
						let his = invokeGet(ruleHolder, "getItem_history");
						his.setVisibility(0);
						his.setText(String(viewCollection.info));
					} else {
						invokeGet(ruleHolder, "getItem_history").setVisibility(8);
					}

					invokeGet(ruleHolder, "getItem_video_card").setOnClickListener((v) => {
						clickListener.tagClick(position);
					});
					invokeGet(ruleHolder, "getItem_ad_bg").setOnClickListener((v) => {
						clickListener.click(position);
					});
					invokeGet(ruleHolder, "getItem_ad_bg").setOnLongClickListener(new View.OnLongClickListener({
						onLongClick(v) {
							clickListener.onLongClick(position);
							return true;
						},
						onLongClickUseDefaultHapticFeedback(v) {
							return false;
						}
					}));
				} catch (e) {
					log(e.toString() + e.stack)
				}
			} else {
				log("错误" + (viewHolder instanceof CollectionListAdapter.RuleHolder));
			}
		},
		getDividerItem() {
			return new CollectionListAdapter.MyDividerItem();
		},
		getItemId(position) {
			return position;
		}
	});

}

function test() {
	collectBottom({
		height: 0.9,
		list: [{
			title: "test",
			pic_url: "https://vd3.bdstatic.com/mda-raqi81i35fcwqknr/1737809543/mda-raqi81i35fcwqknr.jpg?for=bg",
			tag: "okk",
			//desc: "hiker",
			info: "a-b"
		}, {
			title: "test",
			pic_url: "https://vd3.bdstatic.com/mda-raqi81i35fcwqknr/1737809543/mda-raqi81i35fcwqknr.jpg?for=bg",
			tag: "okk",
			desc: "hiker",
			info: "a-b"
		}]
	})
}

function updateRecordsBottom(records) {
	const DefaultItemAnimator = Packages.androidx.recyclerview.widget.DefaultItemAnimator;
	const MyStatusBarUtil = com.example.hikerview.utils.MyStatusBarUtil;
	const UpdateRecordsAdapter = com.example.hikerview.ui.setting.updaterecords.UpdateRecordsAdapter;
	const RecordDetail = com.example.hikerview.ui.setting.updaterecords.RecordDetail;

	let rules = [];
	let myRecordDetail = new JavaAdapter(com.lxj.xpopup.core.BottomPopupView, {

		getImplLayoutId() {
			return R.layout.activit_ad_list;
		},
		onCreate() {
			this.super$onCreate();
			let recyclerView = this.findViewById(R.id.ad_list_recycler_view);
			this.recyclerView = recyclerView;
			recyclerView.setItemAnimator(new DefaultItemAnimator());
			this.findViewById(R.id.ad_list_title_text).setText("更新日志");
			let button = this.findViewById(R.id.ad_list_add);
			button.setText("知道啦");
			button.setOnClickListener(() => {
				this.dismiss();
			});
			let statusBarHeight = MyStatusBarUtil.getStatusBarHeight(getActivityContext()) + DisplayUtil.dpToPx(getActivityContext(), 86);
			let findView2 = this.findViewById(R.id.ad_list_bg);
			//this.findView(0x7f0a007c).setOnClickListener(new -$.Lambda.UpdateRecordsActivity.RJCabNcRtjM6-f9zjjTJnyOIczg(this));
			let layoutParams = findView2.getLayoutParams();
			layoutParams.topMargin = statusBarHeight;
			findView2.setLayoutParams(layoutParams);

			this.adapter = new UpdateRecordsAdapter(getActivityContext(), rules);
			this.recyclerView.setLayoutManager(new GridLayoutManager(getActivityContext(), 1));
			this.recyclerView.setAdapter(this.adapter);
			try {
				for (let it of records) {
					let recordDetail = new RecordDetail();
					recordDetail.setType(1);
					recordDetail.setDetail(String(it.title || ""));
					rules.push(recordDetail);
					for (let item of (it.records || [])) {
						let recordDetail2 = new RecordDetail();
						recordDetail2.setType(2);
						recordDetail2.setDetail(String(item || ""));
						rules.push(recordDetail2);
					}
				}
			} catch (e) {
				log(e.toString());
				setError(e);
			}

		}
	}, getActivityContext());

	let pop = new builderXPopup().asCustom(myRecordDetail);
	showOnUI(pop);
	return pop;
}

function getRulesRecyclerView() {
	if (currentArticleListFragment == null) return null;
	//return getActivityContext().findViewById(R.id.frag_article_list_recycler_view);
	let ArticleListFragmentS = currentArticleListFragment.getClass().getSuperclass();
	let field = ArticleListFragmentS.getDeclaredField("convertView");
	field.setAccessible(true);
	let convertView = field.get(currentArticleListFragment);
	return convertView.findViewById(R.id.frag_article_list_recycler_view);
}

function findRecyclerView(viewGroup) {
	for (let i = 0; i < viewGroup.getChildCount(); i++) {
		let child = viewGroup.getChildAt(i);
		let name = child.getClass().getSimpleName();

		if (name == "RecyclerView") {
			return child;
		}
		if (child instanceof android.view.ViewGroup) {
			let res;
			if ((res = findRecyclerView(child))) {
				return res;
			}
		}
	}
}
function findItemById(id){
	if (typeof id !== "string" || !id) return null;
	let recyclerView = getRulesRecyclerView();
	if (recyclerView == null) return null;
	let list = recyclerView.getAdapter().getList();
	let i = 0;
	let ii = -1
	for (let it of list) {
		if (id == it.getBaseExtra().getId()) {
			ii = i;
			break;
		}
		i++;
	}
	if (ii < 0) return null;
	let mg = recyclerView.getLayoutManager();
	return mg.getChildAt(ii);
}

function selectAttachList(id, {
	click,
	options,
}) {
	let view=findItemById(id);
	options = getStringArray(options, []);
	 if(view==null) return null;

	let pop = builderXPopup(getContext())
		.atView()
		.asAttachList(options, null, (position, text) => {
			tryCallBack(getDefaultValue(click, "function", null), [text, position]);
		});
	showOnUI(pop);
	return pop;
}
/**
 * 显示 Tooltip
 * @param {String|Number} anchorViewId - 目标 View 的 ID
 * @param {String} text - 提示文字
 * @param {Object} options - 可选配置项
 * @param {Boolean} options.isLongDuration - 是否长时间显示 (true=15s, false=10s)
 * @param {Number} options.styleId - 样式资源ID
 * @param {String} options.gravity - 位置: "top", "bottom", "left", "right", "center"
 * @param {String} options.animation - 动画: "default", "slow"
 * @param {String} options.closePolicy - 关闭策略
 * @param {Number} options.offsetX - X轴偏移量
 * @param {Number} options.offsetY - Y轴偏移量
 */
function showTooltip(anchorViewId, text, options) {
	// 处理 options 参数，确保不为空
	var opts = options || {};
	
	// 设置默认值
	var isLongDuration = opts.isLongDuration !== undefined ? opts.isLongDuration : false;
	var styleId = opts.styleId !== undefined ? opts.styleId : null;
	var gravity = opts.gravity !== undefined ? opts.gravity : "bottom";
	var animation = opts.animation !== undefined ? opts.animation : "default";
	var closePolicy = opts.closePolicy !== undefined ? opts.closePolicy : "anywhere_consume";
	var offsetX = opts.offsetX !== undefined ? opts.offsetX : 0;
	var offsetY = opts.offsetY !== undefined ? opts.offsetY : 0;

	runOnUI(function() {
		try {
			// 1. 获取 View
			let anchorView = findItemById(anchorViewId);
			if (anchorView == null) {
				console.warn("未找到ID为 " + anchorViewId + " 的视图");
				return;
			}

			// 2. 导入类
			var Tooltip = Packages.it.sephiroth.android.library.xtooltip.Tooltip;
			var ClosePolicyPkg = Packages.it.sephiroth.android.library.xtooltip.ClosePolicy;
			var Animation = Tooltip.Animation;
			var Gravity = Tooltip.Gravity;

			// ---------------------------------------------------------
			// 3. 处理参数逻辑
			// ---------------------------------------------------------

			// 3.1 动画处理 (Animation)
			var animInstance;
			if (animation && animation.toLowerCase() === "slow") {
				animInstance = Animation.Companion.getSLOW();
			} else {
				animInstance = Animation.Companion.getDEFAULT();
			}

			// 3.2 关闭策略处理 (ClosePolicy)
		   
			var policyInstance;
			var cp = closePolicy.toLowerCase();
		   
			if (cp.includes("inside") && cp.includes("no_consume")) {
				policyInstance = ClosePolicyPkg.Companion.getTOUCH_INSIDE_NO_CONSUME();
			} else if (cp.includes("inside")) {
				policyInstance = ClosePolicyPkg.Companion.getTOUCH_INSIDE_CONSUME(); // 默认 consume
			} else if (cp.includes("outside") && cp.includes("no_consume")) {
				policyInstance = ClosePolicyPkg.Companion.getTOUCH_OUTSIDE_NO_CONSUME();
			} else if (cp.includes("outside")) {
				policyInstance = ClosePolicyPkg.Companion.getTOUCH_OUTSIDE_CONSUME();
			} else if (cp.includes("none")) {
				policyInstance = ClosePolicyPkg.Companion.getTOUCH_NONE();
			} else if (cp.includes("anywhere") && cp.includes("no_consume")) {
				policyInstance = ClosePolicyPkg.Companion.getTOUCH_ANYWHERE_NO_CONSUME();
			} else {
				// 默认策略: TOUCH_ANYWHERE_CONSUME
				policyInstance = ClosePolicyPkg.Companion.getTOUCH_ANYWHERE_CONSUME();
			}

			// 3.3 位置 (Gravity)
			var gravityEnum;
			switch (gravity.toLowerCase()) {
				case "top":	gravityEnum = Gravity.TOP; break;
				case "left":   gravityEnum = Gravity.LEFT; break;
				case "right":  gravityEnum = Gravity.RIGHT; break;
				case "center": gravityEnum = Gravity.CENTER; break;
				case "bottom": 
				default:	   gravityEnum = Gravity.BOTTOM; break;
			}

			var duration = isLongDuration ? 15000 : 10000;
			var finalStyleId = styleId || R.style.MyTooltip;

			// 4. 构建并显示
			new Tooltip.Builder(getActivityContext())
				.styleId(finalStyleId)
				.floatingAnimation(animInstance) // 应用动画参数
				.closePolicy(policyInstance)	 // 应用关闭策略参数
				.anchor(anchorView, offsetX, offsetY, false)
				.text(text)
				.showDuration(duration)
				.create()
				.show(anchorView, gravityEnum, true);

		} catch (e) {
			console.error("Tooltip显示失败: " + e);
		}
	});
}
function loading(title) {
	let pop = builderXPopup()
		.asLoading(getDefaultValue(title, "string", null), 0);
	showOnUI(pop);
	return pop;
}

function selectCenterMark({
	click,
	title,
	options,
	icons,
	noAutoDismiss,
	position
}) {
	options = getStringArray(options, []);
	icons = getNumberArray(icons, null);
	let pop = builderXPopup()
		.autoDismiss(!noAutoDismiss)
		.asCenterList(getDefaultValue(title, "string", null), options, icons, getNumberValue(position, v => v % 1 === 0 && v < options.length && v >= -1, -1), (index, value) => {
			tryCallBack(getDefaultValue(click, "function", null), [value, index]);
		});
	showOnUI(pop);
	return pop;
}

function selectBottomMark({
	click,
	title,
	options,
	icons,
	noAutoDismiss,
	position
}) {
	options = getStringArray(options, []);
	icons = getNumberArray(icons, null);
	let pop = builderXPopup()
		.moveUpToKeyboard(false)
		.autoDismiss(!noAutoDismiss)
		.asBottomList(getDefaultValue(title, "string", null), options, icons, getNumberValue(position, v => v % 1 === 0 && v < options.length && v >= -1, -1), (index, value) => {
			tryCallBack(getDefaultValue(click, "function", null), [value, index]);
		});
	showOnUI(pop);
	return pop;
}

function selectCenter({
	click,
	longClick,
	title,
	options,
	columns,
	position
}) {
	let clickListener = new CustomCenterRecyclerViewPopup.ClickListener({
		onLongClick(value, index) {
			tryCallBack(getDefaultValue(longClick, "function", null), [value, index]);
		},
		click(value, index) {
			tryCallBack(getDefaultValue(click, "function", null), [value, index]);
		}
	});
	options = getStringArray(options, []);
	let custom = new CustomCenterRecyclerViewPopup(getActivityContext())
		.withTitle(getDefaultValue(title, "string", "请选择"))
		.with(options, getDefaultValue(columns, "number", 3), clickListener);
	if (position !== void 0) {
		custom.withSelectedIndex(getNumberValue(position, v => v < options.length && v >= -1, -1));
	}
	let pop = builderXPopup()
		.asCustom(custom);
	showOnUI(pop);
	return pop;
}

function selectBottom({
	click,
	longClick,
	title,
	options,
	columns,
	height,
	noAutoDismiss,
}) {
	let clickListener = new CustomRecyclerViewPopup.ClickListener({
		onLongClick(value, index) {
			tryCallBack(getDefaultValue(longClick, "function", null), [value, index]);
		},
		click(value, index) {
			tryCallBack(getDefaultValue(click, "function", null), [value, index]);
		}
	});
	options = getStringArray(options, []);
	let custom = new CustomRecyclerViewPopup(getActivityContext())
		.withTitle(getDefaultValue(title, "string", "请选择"))
		.height(getNumberValue(height, v => v <= 1 && v > 0, 0.75))
		.dismissAfterClick(!noAutoDismiss).with(options, getDefaultValue(columns, "number", 3), clickListener);
	let pop = builderXPopup()
		.moveUpToKeyboard(false)
		.asCustom(custom);
	showOnUI(pop);
	return pop;
}

function IconExtraMenu(click) {
	this.create = function(parentView, args) {
		const Gravity = android.view.Gravity;
		const ImageView = android.widget.ImageView;

		let menuIcon = new ImageView(getActivityContext());
		let menuIconLayoutParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT, 65);
		menuIconLayoutParams.gravity = Gravity.CENTER_VERTICAL;
		menuIconLayoutParams.setMargins(0, 0, 10, 0);
		menuIcon.setLayoutParams(menuIconLayoutParams);
		menuIcon.setId(R.id.menu_icon);
		menuIcon.setPadding(4, 4, 4, 4);
		//menuIcon.setVisibility(android.view.View.GONE);
		menuIcon.setImageResource(R.drawable.home_left_menu);
		if (typeof click === "function") {
			menuIcon.setOnClickListener(new android.view.View.OnClickListener({
				onClick() {
					tryCallBack(click, args);
				}
			}));
		}

		return menuIcon;
	}
}

function selectCenterIcon({
	click,
	title,
	iconList,
	columns,
	position,
	extraMenu
}) {
	let clickListener = new BookmarkFolderPopup.ClickListener({
		onLongClick(value, index) {},
		click(value, index) {
			tryCallBack(getDefaultValue(click, "function", null), [value, index]);
		}
	});
	iconList = getDefaultValue(iconList, "array", []);
	iconList = getBookList(iconList);

	let custom = new BookmarkFolderPopup(getActivityContext())
		.withTitle(getDefaultValue(title, "string", "请选择"))
		.with(iconList, getDefaultValue(columns, "number", 2), clickListener);
	if (position !== void 0) {
		custom.withSelectedIndex(getNumberValue(position, v => v < iconList.size() && v >= -1, -1));
	}
	XPopup.setAnimationDuration(200);
	let pop = builderXPopup();
	if (extraMenu instanceof IconExtraMenu) {
		pop.setPopupCallback(newSimpleCallback({
			onCreated(basePopupView) {
				let linearLayout = basePopupView.getChildAt(0).getChildAt(0).getChildAt(0);
				try {
					if (linearLayout) {
						const LinearLayout = android.widget.LinearLayout;
						let item = extraMenu.create(linearLayout, []);
						linearLayout.addView(item);
					}
				} catch (e) {
					log(e.toString());
				}
			}
		}))
	}
	pop = pop.asCustom(custom);
	showOnUI(pop);
	return pop;
}

function inputTwoRow({
	title,
	titleHint,
	urlHint,
	titleDefault,
	urlDefault,
	confirm,
	cancel,
	hideCancel,
	noAutoSoft
}) {
	let okListener = new InputPopup.OkListener({
		ok(text1, text2) {
			tryCallBack(getDefaultValue(confirm, "function", null), [text1, text2]);
		}
	});
	let cancelListener = new InputPopup.CancelListener({
		cancel() {
			tryCallBack(getDefaultValue(cancel, "function", null));
		}
	});
	let custom = new InputPopup(getActivityContext())
		.bind(
			getDefaultValue(title, "string", "输入框"),
			getDefaultValue(titleHint, "string", null),
			getDefaultValue(titleDefault, "string", null),
			getDefaultValue(urlHint, "string", null),
			getDefaultValue(urlDefault, "string", null),
			okListener
		)
		.setCancelListener(cancelListener);
	let pop = builderXPopup()
		.autoOpenSoftInput(!noAutoSoft)
		.autoFocusEditText(!noAutoSoft);
	if (hideCancel) {
		pop.setPopupCallback(newSimpleCallback({
			onCreated(basePopupView) {
				let cancelTextView = basePopupView.findViewById(R.id.tv_cancel);
				if (cancelTextView) {
					cancelTextView.setVisibility(8);
				}
				let dividerView = basePopupView.findViewById(R.id.xpopup_divider_h);
				if (dividerView) {
					dividerView.setVisibility(8);
				}
			}
		}));
	}
	pop = pop
		.asCustom(custom);
	showOnUI(pop);
	return pop;
}

function inputAutoRow({
	title,
	hint,
	confirm,
	cancel,
	okTitle,
	cancelTitle,
	defaultValue,
	hideCancel,
	noAutoSoft
}) {
	let okListener = new ConfirmPopup.OkListener({
		ok(text) {
			tryCallBack(getDefaultValue(confirm, "function", null), [text]);
		},
		cancel() {
			tryCallBack(getDefaultValue(cancel, "function", null));
		}
	});
	let custom = new ConfirmPopup(getActivityContext()).bind(getDefaultValue(title, "string", "输入框"), getDefaultValue(hint, "string", ""), okListener)
		.setBtn(getDefaultValue(okTitle, "string", "确认"), getDefaultValue(cancelTitle, "string", "取消"));
	let pop = builderXPopup()
		.autoOpenSoftInput(!noAutoSoft)
		.autoFocusEditText(!noAutoSoft);

	pop.setPopupCallback(newSimpleCallback({
		onCreated(basePopupView) {
			defaultValue = getDefaultValue(defaultValue, "string", null);
			if (defaultValue) {
				let titleEdit = basePopupView.findViewById(R.id.edit_title);
				if (titleEdit) {
					titleEdit.setText(defaultValue);
				}
			}
			if (hideCancel) {
				let cancelTextView = basePopupView.findViewById(R.id.tv_cancel);
				if (cancelTextView) {
					cancelTextView.setVisibility(8);
				}
				let dividerView = basePopupView.findViewById(R.id.xpopup_divider_h);
				if (dividerView) {
					dividerView.setVisibility(8);
				}
			}
		}
	}));

	pop = pop
		.asCustom(custom);
	showOnUI(pop);
	return pop;
}

function inputConfirm({
	title,
	content,
	defaultValue,
	hint,
	confirm,
	cancel,
	textarea,
	maxTextarea,
	hideCancel,
	noAutoSoft
}) {
	let pop = builderXPopup()
		.autoOpenSoftInput(!noAutoSoft)
		.autoFocusEditText(!noAutoSoft);
	if (hideCancel) {
		pop.setPopupCallback(newSimpleCallback({
			onCreated(basePopupView) {
				let cancelTextView = basePopupView.findViewById(R.id.tv_cancel);
				if (cancelTextView) {
					cancelTextView.setVisibility(8);
				}
				let dividerView = basePopupView.findViewById(R.id.xpopup_divider2);
				if (dividerView) {
					dividerView.setVisibility(8);
				}
			}
		}));
	}
	pop = pop.asInputConfirm(getDefaultValue(title, "string", null), getDefaultValue(content, "string", null), getDefaultValue(defaultValue, "string", null), getDefaultValue(hint, "string", null), (text) => {
		tryCallBack(getDefaultValue(confirm, "function", null), [text]);
	}, (text) => {
		tryCallBack(getDefaultValue(cancel, "function", null), [text]);
	}, maxTextarea ? R.layout.xpopup_confirm_input_max : (textarea ? R.layout.xpopup_confirm_input : 0));
	showOnUI(pop);
	return pop;
}

function confirm({
	title,
	content,
	confirm,
	cancel,
	okTitle,
	cancelTitle,
	hideCancel
}) {
	let pop = builderXPopup()
		.asConfirm(getDefaultValue(title, "string", null), getDefaultValue(content, "string", ""), getDefaultValue(cancelTitle, "string", "取消"), getDefaultValue(okTitle, "string", "确认"), () => {
			tryCallBack(getDefaultValue(confirm, "function", null));
		}, () => {
			tryCallBack(getDefaultValue(cancel, "function", null));
		}, !!hideCancel);
	showOnUI(pop);
	return pop;
}

function SettingItem(...arr) {
	if (arr.length === 0) return new OfficeItem("");
	else if (arr.length === 1) return new OfficeItem(String(arr[0]));
	else if (arr.length === 2 && typeof arr[1] === "boolean") return new OfficeItem(String(arr[0]), arr[1] ? 1 : -1);
	else if (arr.length === 2) return new OfficeItem(String(arr[0]), String(arr[1]));
	else if (arr.length === 3) return new OfficeItem(String(arr[0]), arr[1] ? 1 : -1, String(arr[2]));
}

function selectBottomSettingMenu({
	click,
	options,
	onDismiss
}) {
	let onItemClickListener = new SettingMenuPopup.OnItemClickListener({
		onClick(str, officeItem, consumer) {
			tryCallBack(getDefaultValue(click, "function", null), [str, officeItem, () => consumer.accept(officeItem)]);
		}
	});
	options = options.filter(v => v instanceof OfficeItem);
	let arrayList = new ArrayList();
	options.forEach(v => arrayList.add(v));

	let custom = new SettingMenuPopup(getActivityContext(), "设置", arrayList, null, onItemClickListener);
	let pop = builderXPopup()
		.moveUpToKeyboard(false)
		.setPopupCallback(newSimpleCallback({
			onDismiss() {
				tryCallBack(onDismiss);
			}
		}))
		.asCustom(custom);
	showOnUI(pop);
	return pop;
}

selectBottomSettingMenu.SettingItem = SettingItem;

function newSimpleItemTouchHelperCallback(adapter, options) {
	return new JavaAdapter(ItemTouchHelper.Callback, {
		isLongPressDragEnabled() {
			return options.allowDrag; // 允许长按拖动
		},
		isItemViewSwipeEnabled() {
			return false; // 禁用滑动删除
		},
		getMovementFlags(recyclerView, viewHolder) {
			// 允许上下拖动
			let dragFlags = options.dragFlags;
			return this.makeMovementFlags(dragFlags, 0);
		},
		onMove(recyclerView, source, target) {
			adapter.onItemMove(source.getAdapterPosition(), target.getAdapterPosition());
			return true;
		},
		onSwiped(viewHolder, direction) {

		}
	});
}

function setItemTouchHelper(recyclerView, adapter, options) {
	let itemTouchHelper = new ItemTouchHelper(newSimpleItemTouchHelperCallback(adapter, options));
	itemTouchHelper.attachToRecyclerView(recyclerView);
}

function ResExtraInputBox({
	hint,
	click,
	title,
	onChange,
	defaultValue,
	titleVisible
}) {
	let search;
	let edit;
	this.create = function(parentView, args) {
		args = Array.isArray(args) ? args : [];
		let inputItem = android.view.LayoutInflater.from(getActivityContext()).inflate(R.layout.item_input, parentView, false);
		search = inputItem.findViewById(R.id.search);
		edit = inputItem.findViewById(R.id.edit);
		let clearBtn = inputItem.findViewById(R.id.clearBtn);
		let divider = inputItem.findViewById(R.id.divider);
		let pop_input_edit_bg = inputItem.findViewById(R.id.pop_input_edit_bg);
		let search_suggest = inputItem.findViewById(R.id.search_suggest);
		if (typeof title === "string" && title) {
			search.setText(title);
		} else {
			search.setText("确定");
		}
		if (typeof titleVisible === "boolean" && !titleVisible) {
			search.setText("");
			search.setPadding(0, 0, 0, 0);
			search.setVisibility(4);
			divider.setVisibility(4);
		}
		if (typeof click === "function") {
			search.setOnClickListener(new android.view.View.OnClickListener({
				onClick() {
					tryCallBack(click, [String(edit.getText())].concat(args));
				}
			}));
		}

		if (typeof hint === "string" && hint) {
			edit.setHint(hint);
		}

		if (typeof onChange === "function") {
			edit.addTextChangedListener(new android.text.TextWatcher({
				onTextChanged() {},
				beforeTextChanged() {},
				afterTextChanged(s) {
					let text;
					if (s) {
						text = String(s.toString());
						tryCallBack(onChange, [text].concat(args), true);
					}
				}
			}));
		}
		if (typeof defaultValue === "string") {
			edit.setText(defaultValue);
			let len = defaultValue.length;
			edit.setSelection(len, len);
		}
		return inputItem;
	}
	this.setTitle = (title) => {
		if (search && typeof title === "string") {
			search.setText(title);
		}
	}
	this.setDefaultValue = (defaultValue) => {
		if (edit && typeof defaultValue === "string") {
			edit.setText(defaultValue);
			let len = defaultValue.length;
			edit.setSelection(len, len);
		}
	}
	this.setHint = (hint) => {
		if (edit && typeof hint === "string" && hint) {
			edit.setHint(hint);
		}
	}
}

function selectBottomResIcon({
	click,
	longClick,
	menuClick,
	title,
	iconList,
	columns,
	height,
	noAutoDismiss,
	extraInputBox,
	position,
	toPosition,
	beforeShow,
	dragFlags,
	allowDrag,
	drag
}) {
	let clickListener = new CustomCenterRecyclerViewPopup.ClickListener({
		onLongClick(value, index) {},
		click(value, index) {}
	});
	iconList = getDefaultValue(iconList, "array", []);
	let booksList = getBookList(iconList);
	let rv = null,
		tv = null;

	let scrollToPosition = (pos, isScroll) => {
		if (typeof pos === "number" && rv && pos < booksList.length && pos >= -1) {
			if (isScroll) {
				rv.smoothScrollToPosition(pos);
			} else {
				rv.scrollToPosition(pos);
			}
		}
	};
	let setTitle = title => {
		if (tv) tv.setText(String(title));
	};
	let dragOptions = {
		dragFlags: typeof dragFlags == "undefined" ? (ItemTouchHelper.UP | ItemTouchHelper.DOWN | ItemTouchHelper.LEFT | ItemTouchHelper.RIGHT) : dragFlags,
		allowDrag: !!allowDrag,
	}
	let custom = new CustomBottomRecyclerViewPopup(getActivityContext())
		.withTitle(getDefaultValue(title, "string", "请选择"))
		.withHeight(getNumberValue(height, v => v <= 1 && v > 0, 0.75))
		.dismissWhenClick(!noAutoDismiss)
		.with([], getDefaultValue(columns, "number", 2), clickListener)
		.withOnCreateCallback((basePopupView) => {
			try {
				let recyclerView = basePopupView.findViewById(R.id.recyclerView);
				tv = custom.findViewById(R.id.title);
				let linearLayout;
				if (recyclerView) {
					rv = recyclerView;
					recyclerView.setAdapter(iconAdapter);
					setItemTouchHelper(recyclerView, iconAdapter, dragOptions);
					Packages.androidx.core.view.ViewCompat.setBackground(recyclerView, Packages.androidx.core.content.ContextCompat.getDrawable(getActivityContext(), R.drawable.bg_round_all_rice));
				}
				if (recyclerView && (linearLayout = recyclerView.getParent()) && extraInputBox instanceof ResExtraInputBox) {
					let inputItem = extraInputBox.create(linearLayout, [resOptionsManage]);
					let params = inputItem.getLayoutParams();
					params.setMargins(35, 0, 35, 0);
					inputItem.setLayoutParams(params);
					linearLayout.addView(inputItem, 1);
				}
				scrollToPosition(toPosition);
			} catch (e) {
				log(e.toString());
			}
		});
	let clickOrLongClick = (click) => (v, i) => {
		let item = booksList.get(i);
		let items = {
			icon: String(item.getIcon()),
			title: String(item.getTitle()),
			url: String(item.getUrl()),
		};
		let func = () => tryCallBack(getDefaultValue(click, "function", null), [items, Number(i), resOptionsManage]);
		if (noAutoDismiss) {
			func();
		} else {
			custom.dismissWith(func);
		}
	}
	//let iconAdapter = new com.example.hikerview.ui.home.view.BookmarkFolderAdapter(getActivityContext(), booksList, clickOrLongClick(click), false);

	let iconAdapter = new JavaAdapter(IconAdapter, {
		onBindViewHolder(viewHolder, i) {
			this.super$onBindViewHolder(viewHolder, i);


			if (viewHolder instanceof IconAdapter.TitleHolder) {
				//viewHolder.item_bg.setOnLongClickListener(clickOrLongClick(longClick));

				//log(Object.keys(titleHolder))
				let item_bg = viewHolder.itemView.findViewById(R.id.item_bg);
				item_bg && item_bg.setOnLongClickListener((view) => clickOrLongClick(longClick)(view, viewHolder.getAdapterPosition()) || true);
			}
		},
		onItemMove(fromPosition, toPosition) {
			if (fromPosition == toPosition) return; // 位置相同无需操作
			let item = booksList.remove(Number(fromPosition));
			booksList.add(toPosition, item);
			this.notifyItemMoved(fromPosition, toPosition);
			tryCallBack(getDefaultValue(drag, "function", null), [Number(fromPosition), Number(toPosition), resOptionsManage]);
		}
	}, getActivityContext(), booksList, clickOrLongClick(click), false);
	iconAdapter.setSelectedIndex(getNumberValue(position, v => v < iconList.length && v >= -1, -1));
	let resOptionsManage = {
		setTitle: setTitle,
		scrollToPosition: scrollToPosition,
		getSize: () => Number(booksList.length),
		change(list, position) {
			booksList.length = 0;
			Object.assign(booksList, getBookList(list));
			if (position !== void 0) {
				iconAdapter.setSelectedIndex(getNumberValue(position, v => v < iconList.length && v >= -1, -1));
			}
			iconAdapter.notifyDataSetChanged();
		},
		setSelectedIndex(position) {
			iconAdapter.setSelectedIndex(getNumberValue(position, v => v < iconList.length && v >= -1, -1));
			iconAdapter.notifyDataSetChanged();
		},
		removed(pos) {
			if (pos >= booksList.size()) {
				throw new Error("pos大于列表长度");
			}
			iconAdapter.notifyItemRemoved(pos);
		},
		changeColumns: custom.changeSpanCount.bind(custom),
		setAllowDrag(allowDrag) {
			dragOptions.allowDrag = !!allowDrag;
		},
	}
	if (typeof menuClick === "function") {
		custom.withMenu(new android.view.View.OnClickListener({
			onClick() {
				tryCallBack(getDefaultValue(menuClick, "function", null), [resOptionsManage]);
			}
		}));
	}
	let pop = builderXPopup();
	pop.setPopupCallback(newSimpleCallback({
		beforeShow(basePopupView) {
			scrollToPosition(toPosition);
			tryCallBack(getDefaultValue(beforeShow, "function", null), [pop, resOptionsManage]);
		}
	}));
	pop = pop.moveUpToKeyboard(false).asCustom(custom);
	showOnUI(pop);
	return pop;
}

function selectBottomRes({
	click,
	longClick,
	menuClick,
	title,
	options,
	columns,
	height,
	noAutoDismiss,
	extraInputBox,
	toPosition,
	beforeShow,
	onDismiss
}) {
	let clickListener = new CustomCenterRecyclerViewPopup.ClickListener({
		onLongClick(value, index) {
			tryCallBack(getDefaultValue(longClick, "function", null), [value, index, resOptionsManage]);
		},
		click(value, index) {
			tryCallBack(getDefaultValue(click, "function", null), [value, index, resOptionsManage]);
		}
	});
	const list = getStringArray(options, []);
	let rv = null,
		tv = null;
	let scrollToPosition = (pos, isScroll) => {
		if (typeof pos === "number" && rv && pos < list.length && pos >= -1) {
			if (isScroll) {
				rv.smoothScrollToPosition(pos);
			} else {
				rv.scrollToPosition(pos);
			}
		}
	};
	let setTitle = title => {
		if (tv) tv.setText(String(title));
	}
	let custom = new CustomBottomRecyclerViewPopup(getActivityContext())
		.withTitle(getDefaultValue(title, "string", "请选择"))
		.withHeight(getNumberValue(height, v => v <= 1 && v > 0, 0.75))
		.dismissWhenClick(!noAutoDismiss)
		.with(list, getDefaultValue(columns, "number", 2), clickListener)
		.withOnCreateCallback((basePopupView) => {
			let recyclerView = basePopupView.findViewById(R.id.recyclerView);
			rv = recyclerView;
			tv = custom.findViewById(R.id.title);
			let linearLayout;
			if (recyclerView && (linearLayout = recyclerView.getParent()) && extraInputBox instanceof ResExtraInputBox) {

				let inputItem = extraInputBox.create(linearLayout, [resOptionsManage]);
				let params = inputItem.getLayoutParams();
				params.setMargins(35, 0, 35, 0);
				inputItem.setLayoutParams(params);
				linearLayout.addView(inputItem, 1);
			}
		});
	let resOptionsManage = {
		list: list,
		setTitle: setTitle,
		scrollToPosition: scrollToPosition,
		change() {
			checkStringArray(list);
			custom.notifyDataChange();
		},
		removed(pos) {
			checkStringArray(list);
			if (pos >= list.length) {
				throw new Error("pos大于列表长度");
			}
			custom.notifyDataRemoved(pos);
		},
		changeColumns: custom.changeSpanCount.bind(custom)
	}
	if (typeof menuClick === "function") {
		custom.withMenu(new android.view.View.OnClickListener({
			onClick() {
				tryCallBack(getDefaultValue(menuClick, "function", null), [resOptionsManage]);
			}
		}));
	}
	let pop = builderXPopup();
	pop.setPopupCallback(newSimpleCallback({
		beforeShow(basePopupView) {
			scrollToPosition(toPosition);
			tryCallBack(getDefaultValue(beforeShow, "function", null), [pop, resOptionsManage]);
		},
		onDismiss(basePopupView) {
			tryCallBack(getDefaultValue(onDismiss, "function", null), []);
		}
	}));
	pop = pop.moveUpToKeyboard(false).asCustom(custom);
	showOnUI(pop);
	return pop;
}

function infoBottom({
	title,
	options,
	click,
	longClick
}) {
	let clickListener = new com.example.hikerview.ui.setting.file.FileDetailAdapter.OnClickListener({
		click(value) {
			tryCallBack(getDefaultValue(click, "function", null), [value]);
		},
		longClick(view, value) {
			tryCallBack(getDefaultValue(longClick, "function", null), [value]);
		}
	});

	let custom = new FileDetailPopup(
			getActivityContext(),
			getDefaultValue(title, "string", null),
			getStringArray(options, [])
		)
		.withClickListener(clickListener);
	let pop = builderXPopup()
		.moveUpToKeyboard(false)
		.asCustom(custom);
	showOnUI(pop);
	return pop;
}

function copyBottom(title, content) {
	if (cannotTouchUI) return null;
	let custom = new CustomCopyPopup(getActivityContext())
		.with(
			getDefaultValue(title, "string", null),
			getDefaultValue(content, "string", ""),
		);
	let pop = builderXPopup()
		.moveUpToKeyboard(false)
		.asCustom(custom);
	showOnUI(pop);
	return pop;
}

function selectCenterColor(colors, callBack) {
	if (typeof colors === "function") {
		callBack = colors;
	}
	colors = getStringArray(colors, []);
	let custom = new CustomColorPopup(getActivityContext());
	custom.setColorSelect(new CustomColorPopup.OnColorSelect({
		select(value) {
			tryCallBack(getDefaultValue(callBack, "function", null), [value]);
		}
	}));
	let pop = builderXPopup()
		.setPopupCallback(newSimpleCallback({
			onCreated(basePopupView) {
				const count = colors.length > 8 ? 8 : colors.length;
				for (let i = 0; i < count; i++) {
					if (colors[i]) {
						let color = android.graphics.Color.parseColor(colors[i]);
						let relativeLayout = basePopupView.findViewById(R.id["color" + (i + 1) + "_bg"]);
						relativeLayout.setTag(colors[i]);
						relativeLayout.getChildAt(0).setCardBackgroundColor(color);
						relativeLayout.getChildAt(1).setTextColor(color);
					}
				}
			}
		}))
		.asCustom(custom);
	showOnUI(pop);
	return pop;
}

function chefSnackbarMake({
	content,
	duration,
	confirm,
	cancel,
	okTitle,
	cancelTitle
}) {
	let decorView = getContext().getWindow().getDecorView();
	ChefSnackbar.Companion.make(decorView)
		.setText(getDefaultValue(content, "string", ""))
		.setDuration(getDefaultValue(okTitle, "number", 0))
		.setAction(getDefaultValue(okTitle, "string", "确认"), function() {
			tryCallBack(getDefaultValue(confirm, "function", null));
		})
		.setCancelButton(getDefaultValue(cancelTitle, "string", "取消"), function() {
			tryCallBack(getDefaultValue(cancel, "function", null));
		})
		.show();
}

function toastMeg(text, type) {
	switch (type) {
		case toastMeg.LC:
			ToastMgr.longCenter(getContext(), String(text));
			break;
		case toastMeg.SC:
			ToastMgr.shortCenter(getContext(), String(text));
			break;
		case toastMeg.LB:
			ToastMgr.longBottomCenter(getContext(), String(text));
			break;
		case toastMeg.SC:
		default:
			ToastMgr.shortBottomCenter(getContext(), String(text));
			break;
	}
}
toastMeg.LC = 1;
toastMeg.SC = 2;
toastMeg.LB = 3;
toastMeg.SB = 4;

function getClipTopData() {
	try {
		const Context = android.content.Context;
		const context = getContext();
		let clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE);
		let clipData = clipboard.getPrimaryClip();
		if (clipData != null && clipData.getItemCount() > 0) {
			let text = clipData.getItemAt(0).getText();
			if (text != null) {
				return String(text.toString());
			}
		}
		return "";
	} catch (e) {
		log(e.toString());
		return "";
	}
}

function confirmSync({
	title,
	content,
	okTitle,
	cancelTitle,
	hideCancel,
	noDismissOnBack,
	noDismissOnBlank
}) {
	let countDownLatch = new java.util.concurrent.CountDownLatch(1);
	let result = false;
	showOnUI(
		builderXPopup()
		.dismissOnTouchOutside(!noDismissOnBlank)
		.dismissOnBackPressed(!noDismissOnBack)
		.setPopupCallback(newSimpleCallback({
			onDismiss(basePopupView) {
				countDownLatch.countDown();
			}
		}))
		.asConfirm(getDefaultValue(title, "string", null), getDefaultValue(content, "string", ""), getDefaultValue(cancelTitle, "string", "取消"), getDefaultValue(okTitle, "string", "确认"), () => {
			result = true;
		}, () => {
			result = false;
		}, !!hideCancel)
	);
	countDownLatch.await();
	return result;
}

function inputConfirmSync({
	title,
	content,
	defaultValue,
	hint,
	textarea,
	maxTextarea,
	hideCancel,
	noAutoSoft,
	noDismissOnBack,
	noDismissOnBlank
}) {
	let countDownLatch = new java.util.concurrent.CountDownLatch(1);
	let result = "";
	showOnUI(
		builderXPopup()
		.autoOpenSoftInput(!noAutoSoft)
		.autoFocusEditText(!noAutoSoft)
		.dismissOnTouchOutside(!noDismissOnBlank)
		.dismissOnBackPressed(!noDismissOnBack)
		.setPopupCallback(newSimpleCallback({
			onCreated(basePopupView) {
				if (hideCancel) {
					let cancelTextView = basePopupView.findViewById(R.id.tv_cancel);
					if (cancelTextView) {
						cancelTextView.setVisibility(8);
					}
					let dividerView = basePopupView.findViewById(R.id.xpopup_divider2);
					if (dividerView) {
						dividerView.setVisibility(8);
					}
				}
			},
			onDismiss(basePopupView) {
				countDownLatch.countDown();
			}
		}))
		.asInputConfirm(getDefaultValue(title, "string", null), getDefaultValue(content, "string", null), getDefaultValue(defaultValue, "string", null), getDefaultValue(hint, "string", null), (text) => {
			result = text;
		}, null, maxTextarea ? R.layout.xpopup_confirm_input_max : (textarea ? R.layout.xpopup_confirm_input : 0))
	);
	countDownLatch.await();
	return result;
}

function dialogShowOnUI(dialogBuilder, callBack) {
	runOnUI(() => {
		let dialog = dialogBuilder.create();
		DialogUtil.INSTANCE.showAsCard(getActivityContext(), dialog);
		if (callBack) {
			callBack(dialog);
		}

	});
}

function setAlertDialogButton({
	rightTitle,
	rightClick,
	leftTitle,
	leftClick,
	centerTitle,
	centerClick
}, dialogBuilder, getParam) {
	if (rightTitle || rightClick) {
		rightClick = getDefaultValue(rightClick, "function", null);
		dialogBuilder.setPositiveButton(getDefaultValue(rightTitle, "string", "确认"), (dialog) => {
			tryCallBack(rightClick, getParam(dialog));
		});
	}
	if (leftTitle || leftClick) {
		leftClick = getDefaultValue(leftClick, "function", null);
		dialogBuilder.setNeutralButton(getDefaultValue(leftTitle, "string", "忽略"), (dialog) => {
			tryCallBack(leftClick, getParam(dialog));
		});
	}
	if (centerTitle || centerClick) {
		centerClick = getDefaultValue(centerClick, "function", null);
		dialogBuilder.setNegativeButton(getDefaultValue(centerTitle, "string", "取消"), (dialog) => {
			tryCallBack(centerClick, getParam(dialog));
		});
	}
}

function setAlertDialogButtonTitle({
	rightTitle,
	rightClick,
	leftTitle,
	leftClick,
	centerTitle,
	centerClick
}, dialogBuilder) {
	if (rightTitle || rightClick) {
		dialogBuilder.setPositiveButton(getDefaultValue(rightTitle, "string", "确认"), null);
	}
	if (leftTitle || leftClick) {
		dialogBuilder.setNeutralButton(getDefaultValue(leftTitle, "string", "忽略"), null);
	}
	if (centerTitle || centerClick) {
		dialogBuilder.setNegativeButton(getDefaultValue(centerTitle, "string", "取消"), null);
	}
}

function setAlertDialogButtonFunc({
	rightTitle,
	rightClick,
	leftTitle,
	leftClick,
	centerTitle,
	centerClick
}, dialog, getParam) {
	const DialogInterface = android.content.DialogInterface;
	if (rightTitle || rightClick) {
		rightClick = getDefaultValue(rightClick, "function", null);
		dialog.getButton(DialogInterface.BUTTON_POSITIVE).setOnClickListener(() => {
			tryCallBack(rightClick, getParam(dialog));
		});
	}
	if (leftTitle || leftClick) {
		leftClick = getDefaultValue(leftClick, "function", null);
		dialog.getButton(DialogInterface.BUTTON_NEUTRAL).setOnClickListener(() => {
			tryCallBack(leftClick, getParam(dialog));
		});
	}
	if (centerTitle || centerClick) {
		centerClick = getDefaultValue(centerClick, "function", null);
		dialog.getButton(DialogInterface.BUTTON_NEGATIVE).setOnClickListener(() => {
			tryCallBack(centerClick, getParam(dialog));
		});
	}
}

function multiChoice({
	title,
	options,
	checkedIndexs,
	noAutoDismiss,
	onChoice,
}) {
	options = getStringArray(options, []);
	checkedIndexs = getDefaultValue(checkedIndexs, "array", []);
	let checkedItems = new Array(options.length).fill(false);
	checkedIndexs.forEach(i => checkedItems[i] = true);
	checkedItems.length = options.length;
	onChoice = getDefaultValue(onChoice, "function", null);
	let setItemChecked = (dialog, newcheckedIndexs) => {
		if (!Array.isArray(newcheckedIndexs)) return;

		checkedItems.fill(false);
		newcheckedIndexs.forEach(i => checkedItems[i] = true);

		let listView = dialog.getListView();

		for (let i = 0; i < options.length; i++) {
			listView.setItemChecked(i, checkedItems[i]);
		}
		listView.getAdapter().notifyDataSetChanged();
	};
	let dialogBuilder = new AlertDialog.Builder(getActivityContext())
		.setTitle(getDefaultValue(title, "string", null))
		.setMultiChoiceItems(options, checkedItems, (v, i, b) => {
			checkedItems[i] = b;
			tryCallBack(onChoice, [i, b]);
		});

	if (noAutoDismiss) {
		setAlertDialogButtonTitle(arguments[0], dialogBuilder);
		dialogShowOnUI(dialogBuilder, (dialog) => {
			setAlertDialogButtonFunc(arguments[0], dialog, () => [options, checkedItems, setItemChecked.bind(null, dialog), dialog.dismiss.bind(dialog)]);
		});
	} else {
		setAlertDialogButton(arguments[0], dialogBuilder, () => [options, checkedItems]);
		dialogShowOnUI(dialogBuilder);
	}
}

function getSeekAndLayout(max, pos, onChange) {
	const Bundle = android.os.Bundle;
	const LinearLayout = android.widget.LinearLayout;
	const SeekBar = android.widget.SeekBar;
	const TextView = android.widget.TextView;
	const Gravity = android.view.Gravity;
	const View = android.view.View;
	const LayoutParams = android.view.ViewGroup.LayoutParams;
	const RelativeLayout = android.widget.RelativeLayout;
	const ImageView = android.widget.ImageView;
	const Spanned = android.text.Spanned;
	const Html = android.text.Html;
	let linearLayout = new LinearLayout(getActivityContext());
	linearLayout.setOrientation(LinearLayout.VERTICAL);
	linearLayout.setLayoutParams(new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT));
	linearLayout.setPadding(65, 50, 60, 50);

	let titleStart = new TextView(getActivityContext());
	titleStart.setId(View.generateViewId());
	titleStart.setLayoutParams(new LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT));
	titleStart.setTextSize(17);
	titleStart.setPadding(0, 0, 0, 20);
	let initText = tryCallBack(onChange, [pos, max, Html.fromHtml], true);
	if (typeof initText === "string" || initText instanceof Spanned) {
		titleStart.setText(initText);
	}
	let relativeLayout = new RelativeLayout(getActivityContext());
	relativeLayout.setLayoutParams(new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT));

	let startImgStart = new ImageView(getActivityContext());
	startImgStart.setId(View.generateViewId());
	startImgStart.setLayoutParams(new LayoutParams(32, 32));
	startImgStart.setPadding(4, 4, 4, 4);
	startImgStart.setImageResource(R.drawable.ic_arrow_start);

	let startImgEnd = new ImageView(getActivityContext());
	startImgEnd.setId(View.generateViewId());
	startImgEnd.setLayoutParams(new LayoutParams(32, 32));
	startImgEnd.setPadding(4, 4, 4, 4);
	startImgEnd.setImageResource(R.drawable.ic_arrow_end);

	let seekBar = new SeekBar(getActivityContext());
	seekBar.setLayoutParams(new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT));
	seekBar.setMax(max);
	seekBar.setProgress(pos);

	linearLayout.addView(titleStart);
	linearLayout.addView(relativeLayout);

	let layoutParams = new RelativeLayout.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
	layoutParams.addRule(RelativeLayout.CENTER_VERTICAL, RelativeLayout.TRUE);
	startImgStart.setLayoutParams(layoutParams);
	relativeLayout.addView(startImgStart);

	layoutParams = new RelativeLayout.LayoutParams(LayoutParams.WRAP_CONTENT, LayoutParams.WRAP_CONTENT);
	layoutParams.addRule(RelativeLayout.ALIGN_PARENT_END, RelativeLayout.TRUE);
	layoutParams.addRule(RelativeLayout.CENTER_VERTICAL, RelativeLayout.TRUE);
	startImgEnd.setLayoutParams(layoutParams);
	relativeLayout.addView(startImgEnd);

	layoutParams = new RelativeLayout.LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT);
	layoutParams.addRule(RelativeLayout.END_OF, startImgStart.getId());
	layoutParams.addRule(RelativeLayout.START_OF, startImgEnd.getId());
	layoutParams.addRule(RelativeLayout.CENTER_VERTICAL, RelativeLayout.TRUE);
	seekBar.setLayoutParams(layoutParams);
	relativeLayout.addView(seekBar);

	startImgStart.setOnClickListener(() => {
		let progress = seekBar.getProgress();
		if (progress <= 0 || progress > max) {
			return;
		}
		seekBar.setProgress(progress - 1);
	});
	startImgEnd.setOnClickListener(() => {
		let progress = seekBar.getProgress();
		if (progress < 0 || progress >= max) {
			return;
		}
		seekBar.setProgress(progress + 1);
	});
	seekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener({
		onProgressChanged(seekBar, progress, fromUser) {
			let res = tryCallBack(onChange, [progress, max, Html.fromHtml], true);
			if (typeof res === "string" || initText instanceof Spanned) {
				titleStart.setText(res);
			}
		},
		onStartTrackingTouch(seekBar) {},
		onStopTrackingTouch(seekBar) {}
	}));
	return [seekBar, linearLayout];
}

function seekCenter({
	title,
	max,
	pos,
	onChange,
}) {
	max = parseInt(max), pos = parseInt(pos) || 0;
	if (!max || max < pos || pos < 0) {
		throw Error("max和pos必须为整数，且max>0,max>=pos>=0");
	}
	let builder = new AlertDialog.Builder(getActivityContext());
	builder.setTitle(getDefaultValue(title, "string", null));
	let [seekBar, linearLayout] = getSeekAndLayout(max, pos, onChange);
	setAlertDialogButton(arguments[0], builder, () => [Number(seekBar.getProgress()), max]);
	builder.setView(linearLayout);
	dialogShowOnUI(builder);
}

function canBiometric() {
	return Number(BiometricManager.from(getActivityContext()).canAuthenticate())
}

function checkByBiometric(success) {
	if (typeof success !== "function") return;
	let can = canBiometric();
	if (can !== 0) return can;
	runOnUI(() => {
		com.example.hikerview.ui.setting.office.MoreSettingOfficer.INSTANCE.checkByBiometric(getActivityContext(), () => {
			tryCallBack(success, [], true);
		});
	});
}


function decodeQRCode(path) {
	let result = null;
	try {
		let bitmap = android.graphics.BitmapFactory.decodeFile(path);
		if (bitmap == null) return result;
		let hints = new java.util.Hashtable();
		let width = bitmap.getWidth();
		let height = bitmap.getHeight();
		let pixels = java.lang.reflect.Array.newInstance(java.lang.Class.forName("java.lang.Integer"), width * height);
		pixels = java.util.Arrays.stream(pixels).mapToInt(v => 0).toArray();
		bitmap.getPixels(pixels, 0, width, 0, 0, width, height);
		let source = new com.google.zxing.RGBLuminanceSource(width, height, pixels);
		let binaryBitmap = new com.google.zxing.BinaryBitmap(new com.google.zxing.common.HybridBinarizer(source));
		let decodedResult = new com.google.zxing.MultiFormatReader().decode(binaryBitmap, hints);
		result = String(decodedResult.getText());
	} catch (e) {}
	return result;
}

function getDanmakuContext() {
	let activityContext = getContext();
	if (activityContext instanceof com.example.hikerview.ui.video.VideoPlayerActivity) {
		let videoPlayerActivityClass = activityContext.getClass();
		let videoPlayerViewField = videoPlayerActivityClass.getDeclaredField("videoPlayerView");
		videoPlayerViewField.setAccessible(true);
		let videoPlayerView = videoPlayerViewField.get(activityContext);
		let baseViewClass = videoPlayerView.getClass().getSuperclass();
		let danmakuContextField = baseViewClass.getDeclaredField("danmakuContext");
		danmakuContextField.setAccessible(true);
		let danmakuContext = danmakuContextField.get(videoPlayerView);

		let danmakuViewField = baseViewClass.getDeclaredField("danmakuView");
		danmakuViewField.setAccessible(true);
		let danmakuView = danmakuViewField.get(videoPlayerView);

		let playField = videoPlayerActivityClass.getDeclaredField("player");
		playField.setAccessible(true);
		let play = playField.get(activityContext);
		return [danmakuContext, danmakuView, play];
	}
	return [null, null, null];

}

function sendDanmaku(danmu) {
	let [danmakuContext, danmakuView, play] = getDanmakuContext();

	if (danmakuView != null && danmakuContext != null) {
		let newDanmu = danmakuContext.mDanmakuFactory.createDanmaku(danmu.type || 1, danmakuContext);
		newDanmu.text = danmu.text;
		newDanmu.textSize = danmu.size || 50;
		newDanmu.textColor = danmu.color || 16777215;
		//newDanmu.borderColor = 16777215; //边框貌似不生效
		runOnUI(() => {
			newDanmu.setTime(danmu.time || (play.getCurrentPosition() + 100));
			danmakuView.addDanmaku(newDanmu);

		});
		return true;
	} else {
		return false
	}
}

function scrollToPageTop() {
	EventBus.getDefault().post(new com.example.hikerview.event.OnTopEvent());
	return true;
}

function smoothScrollWithSpeed(context, recyclerView, position, speedMsPerPx) {
	let manager = recyclerView.getLayoutManager();
	if (manager == null) return;
	speedMsPerPx = Number(speedMsPerPx);
	speedMsPerPx = Number.isNaN(speedMsPerPx) ? 25 : speedMsPerPx;
	let scroller = new JavaAdapter(Packages.androidx.recyclerview.widget.LinearSmoothScroller, {
		calculateSpeedPerPixel(displayMetrics) {
			return speedMsPerPx / displayMetrics.densityDpi;
		}
	}, context);
	scroller.setTargetPosition(position);
	manager.startSmoothScroll(scroller);
}

function scrollSmooth(idOrPos, isScroll, speedMsPerPx) {

	if (!(typeof idOrPos == "string" || typeof idOrPos == "number")) return false;

	let context = getActivityContext();
	let recyclerView = getRulesRecyclerView();
	if (recyclerView == null) return false;
	if (typeof idOrPos === "string") {
		let list = recyclerView.getAdapter().getList();
		let i = 0;
		let ii = -1
		for (let it of list) {
			if (idOrPos == it.getBaseExtra().getId()) {
				ii = i;
				break;
			}
			i++;
		}
		if (ii < 0) return false;
		let gridManager = recyclerView.getLayoutManager();

		if (gridManager instanceof GridLayoutManager) {
			//let fvPos = gridManager.findFirstVisibleItemPosition();
			let lvPos = gridManager.findLastVisibleItemPosition();

			idOrPos = ii > lvPos ? ii + 1 : ii;

		}
	}
	if (idOrPos < 0) {
		idOrPos = Math.max(recyclerView.getAdapter().getItemCount() + idOrPos, 0);
	}
	idOrPos = Math.min(recyclerView.getAdapter().getItemCount() - 1, idOrPos);
	if (isScroll) {
		if (typeof speedMsPerPx === "number") {
			smoothScrollWithSpeed(context, recyclerView, idOrPos, speedMsPerPx);
		} else {
			recyclerView.smoothScrollToPosition(idOrPos);
		}
	} else {
		recyclerView.scrollToPosition(idOrPos);
	}
	return true;
}



function getCurrentPlayPosition() {
	let [danmakuContext, danmakuView, play] = getDanmakuContext();
	if (play != null) {
		return Number(play.getCurrentPosition());
	}
	return null;
}
/**
 * 显示 RhinoUI 生成的布局弹窗
 * @param {Object} uiObj RhinoUI.render() 返回的对象 或 View 对象
 * @param {Object} options 配置项
 * {
 * type: "center" | "bottom", // 弹窗类型，默认 center
 * width: 300, // 宽度 (dp)，可选
 * height: 400, // 高度 (dp)，可选
 * maxHeight: 500, // 最大高度 (dp)，仅 bottom 类型常用
 * borderRadius: 16, // 圆角 (dp)
 * dismissOnTouchOutside: true, // 点击外部关闭
 * anim: XPopup.anim.ScaleAlphaFromCenter, // 动画枚举
 * onShow: function(){}, // 显示回调
 * onDismiss: function(){} // 关闭回调
 * }
 */

function showRhinoUI(uiObj, options) {
	options = options || {};
	let type = options.type || "center";
	
	// 1. 获取 View (兼容 RhinoUI Wrapper 或 原生 View)
	let targetView = null;
	if (uiObj && uiObj.view && typeof uiObj.view.raw === "function") {
		targetView = uiObj.view.raw();
	} else if (uiObj instanceof android.view.View) {
		targetView = uiObj;
	} else {
		throw new Error("showRhinoUI: 参数必须是 RhinoUI 对象或 Android View");
	}

	// 2. 构建 Builder
	let builder = builderXPopup();
	if (options.dismissOnTouchOutside === false) builder.dismissOnTouchOutside(false);
	if (options.dismissOnBackPressed === false) builder.dismissOnBackPressed(false);
	if (options.enableDrag === false) builder.enableDrag(false);
	if (options.borderRadius !== void 0) builder.borderRadius(dpToPx(options.borderRadius));
	if (options.anim) builder.popupAnimation(options.anim);
	
	builder.setPopupCallback(newSimpleCallback({
		onShow: options.onShow,
		onDismiss: options.onDismiss,
		beforeShow: options.beforeShow
	}));

	// 3. 定义 Adapter 实现
	let CustomPopup;

	if (type === "bottom") {
		// =============================================
		// BottomPopupView 专用策略：重写 addInnerContent
		// =============================================
		CustomPopup = JavaAdapter(com.lxj.xpopup.core.BottomPopupView, {
			// 返回 0，因为我们覆盖了使用它的 addInnerContent 方法
			getImplLayoutId: function() {
				return 0;
			},

			// 【核心】覆盖此方法，直接将 View 加入容器，跳过 XML 解析
			addInnerContent: function() {
				// 1. 获取容器 SmartDragLayout
				// 源码中它是在 initPopupContent 时赋值的，这里我们直接找子控件
				// BottomPopupView 的根布局就是 SmartDragLayout
				let container = this.getChildAt(0); 
				
				// 2. 准备 View
				if (targetView.getParent() != null) {
					targetView.getParent().removeView(targetView);
				}
				
				// 3. 设置 LayoutParams (底部弹窗宽度撑满)
				let w = options.width ? dpToPx(options.width) : -1; // -1 = MATCH_PARENT
				let h = options.height ? dpToPx(options.height) : -2; // -2 = WRAP_CONTENT
				let lp = new android.widget.FrameLayout.LayoutParams(w, h);
				// bottomContainer 内部默认就是底部对齐，其实不需要 Gravity，但加上保险
				lp.gravity = 81; // Gravity.BOTTOM | CENTER_HORIZONTAL

				// 4. 添加到 SmartDragLayout 容器中
				container.addView(targetView, lp);
			},

			getMaxHeight: function() {
				if (options.maxHeight) return dpToPx(options.maxHeight);
				return this.super$getMaxHeight();
			}
		}, getActivityContext());

	} else {
		// =============================================
		// CenterPopupView 策略：onCreate + removeAllViews
		// =============================================
		CustomPopup = JavaAdapter(com.lxj.xpopup.core.CenterPopupView, {
			// 必须返回有效 ID 骗过检查
			getImplLayoutId: function() {
				return android.R.layout.simple_list_item_1; 
			},
			
			onCreate: function() {
				this.super$onCreate();
				// 清空占位 View
				this.removeAllViews();
				
				if (targetView.getParent() != null) {
					targetView.getParent().removeView(targetView);
				}
				
				let w = options.width ? dpToPx(options.width) : -2;
				let h = options.height ? dpToPx(options.height) : -2;
				let lp = new android.widget.FrameLayout.LayoutParams(w, h);
				lp.gravity = 17; // Center
				
				this.addView(targetView, lp);
			}
		}, getActivityContext());
	}

	// 4. 显示
	let popup = builder.asCustom(CustomPopup);
	showOnUI(popup);
	return popup;
}
let popf = {
	confirm,
	inputAutoRow,
	inputConfirm,
	selectCenter,
	selectCenterMark,
	selectBottom,
	selectBottomMark,
	selectCenterIcon,
	inputTwoRow,
	selectBottomSettingMenu,
	selectBottomRes,
	infoBottom,
	copyBottom,
	selectCenterColor,
	confirmSync,
	inputConfirmSync,
	chefSnackbarMake,
	toastMeg,
	multiChoice,
	seekCenter,
	checkByBiometric,
	selectAttachList,
	selectBottomResIcon,
	updateRecordsBottom,
	FlexMenuBottom
};
let forcetHrottle = ["hikerPop_FlexMenuBottom"];

function throttle(func, key) {
	let funcc = function(...args) {
		let time = throttleTime;
		if (time == 0 && forcetHrottle.includes(key)) {
			time = 200;
		}
		if (time > 0 && !canTouchUI(key, time)) return (throttleTime = 0);
		return func.apply(null, args);
	}
	return Object.assign(funcc, func);
}
for (let funcName in popf) {
	popf[funcName] = throttle(popf[funcName], "hikerPop_" + funcName);
}

$.exports = {
	IconExtraMenu,
	isDarkMode,
	ResExtraInputBox,
	icon: R.drawable,
	playVideos,
	getClipTopData,
	setUseStartActivity,
	runOnNewThread,
	runOnUIThread: runOnUI,
	canBiometric,
	decodeQRCode,
	simpleRoute,
	test,
	setNextThrottle,
	sendDanmaku,
	getCurrentPlayPosition,
	scrollToPageTop,
	scrollSmooth,
	DragFlags: ItemTouchHelper,
	showTooltip,
	showRhinoUI
};
Object.assign($.exports, popf);
