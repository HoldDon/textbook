# gis
## 坐标系
### 分类
1. 地理坐标系
    - 4326 WGS84
    - 4490 CGCS2000
2. 投影坐标系
    - 3857 WGS84-web墨卡托
### 正射切片
1. **vue+leaflet加载4490天地图**  
```js
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import "proj4"
import "proj4leaflet"

let crs4490 = new L.Proj.CRS("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs", {
        resolutions: [
            1.40625,
            0.703125,
            0.3515625,
            0.17578125,
            0.087890625,
            0.0439453125,
            0.02197265625,
            0.010986328125,
            0.0054931640625,
            0.00274658203125,
            0.001373291015625,
            6.866455078125E-4,
            3.4332275390625E-4,
            1.71661376953125E-4,
            8.58306884765625E-5,
            4.291534423828125E-5,
            2.1457672119140625E-5,
            1.0728836059570312E-5,
            5.364418029785156E-6,
            2.682209064925356E-6,
            1.3411045324626732E-6
        ],
        origin: [-180, 90],
    })
//矢量底图
let vecLayer = L.tileLayer(
    "http://t{s}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles"
    + "&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=" + tk, {
    subdomains: subdomains,
});

//矢量注记
let cvaLayer = L.tileLayer(
    "http://t{s}.tianditu.gov.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles"
    + "&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=" + tk, {
    subdomains: subdomains,
});

let vecG = L.layerGroup([vecLayer, cvaLayer]);

let map: L.Map;
map = L.map("leaflet", {
    minZoom: 3,
    maxZoom: 18,
    center: [31.33269, 120.606344],
    zoom: 2,
    crs: crs4490,
    layers: [vecG],
    attributionControl: false
});
``` 
2.**leaflet加载4490正射tiles**  
```js{4}
L.tileLayer(
    "http://192.168.8.7:6001/odm/1baa87cf904e6be86c512b039dd692d4/orthophoto_tiles/{z}/{y}/{x}.png",
    {
        zoomOffset: -1,
    }
).addTo(map);
```



## postgis
### sql
将geometry类型的字段直接转换为svg图片，以显示轮廓。  
核心做法:
1. 按最小的x、y坐标负向平移，以实现初始坐标为0
2. 取宽和高中的较大值来进行放大
3. 对svg的viewBox进行平移，以实现轮廓完全接边展示
 
```sql 
SELECT ST_Scale(ST_Translate(geom, -1 * ST_XMin(geom), -1 * ST_YMin(geom))
	, CEIL(GREATEST((ST_XMax(geom)-ST_YMin(geom)),(ST_YMax(geom)-ST_XMin(geom))))
	, CEIL(GREATEST((ST_XMax(geom)-ST_YMin(geom)),(ST_YMax(geom)-ST_XMin(geom))))) AS scale_geom
	, CEIL(GREATEST((ST_XMax(geom)-ST_YMin(geom)),(ST_YMax(geom)-ST_XMin(geom)))) AS sc
FROM region
WHERE geom IS NOT NULL
LIMIT 10
),
p AS (
SELECT ST_AsSvg(scale_geom,0,4) AS svg
,sc,ST_XMin(scale_geom) AS x_min
, ST_YMin(scale_geom) AS y_min
, ST_XMax(scale_geom) AS x_max
, ST_YMax(scale_geom) AS y_max
FROM q
)
SELECT CONCAT('<svg width="300" height="300" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="',
            CONCAT_WS(' ', 0, CEIL(-1*y_max), CEIL(( x_max-x_min)), CEIL(( y_max-y_min)) ), '"> <path d="', svg, '"></path></svg>') AS "svg"
FROM p 
```
