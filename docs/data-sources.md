# 数据接口汇总

## NowAPI（行情四卡）
- 基础地址：`https://sapi.k780.com/`
- 公共参数：`appkey=${NOWAPI_APPKEY}`、`sign=${NOWAPI_SIGN}`、`format=json`

### 上海黄金（国内现货）
- 接口：`app=finance.gold_price`
- 参数：`goldid=1053`，`version=3`
- 关键字段：`last_price`（现价）、`buy_price`、`sell_price`、`high_price`、`low_price`、`yesy_price`、`uptime`

### 国际黄金/白银
- 接口：`app=finance.gold_price`
- 参数：
  - 黄金：`goldid=1201`
  - 白银：`goldid=1203`
- 关键字段：同上（`last_price` 等）

### COMEX 黄金期货
- 接口：`app=quote.futures`
- 参数：`ftsIdS=31001`
- 关键字段：`lastPrice`（最新）、`buy/bid`、`sell/ask`、`highPrice`、`lowPrice`、`yesyPrice`、`upTime`

## ALAPI（品牌金价）
- 接口：`https://v3.alapi.cn/api/gold/brand`
- 参数：`token=${ALAPI_TOKEN}`
- 关键字段：`name`（品牌名）、`price`（零售价）、`price_2`（回购价）、`updatetime`（更新时间）

## 环境变量
- `NOWAPI_APPKEY`、`NOWAPI_SIGN`、`NOWAPI_BASE_URL`
- `ALAPI_TOKEN`
- `NEXT_PUBLIC_LIVE_SYNC_MS`（前端轮询）

## 对应前端映射
- `xauusd-spot` ↔ NowAPI `goldid=1201`
- `xagusd-spot` ↔ NowAPI `goldid=1203`
- `au-domestic` ↔ NowAPI `goldid=1053`
- `comex-gc-main` ↔ NowAPI `ftsIdS=31001`
- 品牌表格 ↔ ALAPI `gold/brand`（零售价=`price`，回购价=`price_2`）
