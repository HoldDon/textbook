# gis
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
