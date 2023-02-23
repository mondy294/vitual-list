import { useRef, useEffect, useState, useMemo } from 'react'
import './index.scss'
export default function LongList() {
    interface showrange {
        start: number
        end: number
    }
    // 可视区域总高度
    const SCROLL_VIEW_HEIGHT: number = 500;
    // 列表中每一项的高度
    const ITEM_HEIGHT: number = 50;

    // 能看到多少就预加载多少
    const PRE_LOAD_COUNT: number = SCROLL_VIEW_HEIGHT / ITEM_HEIGHT;

    // 可视页面容器
    const containerRef = useRef<any>();
    // 源数据
    const [sourceData, setSourceData] = useState<number[]>([]);
    // 展示范围
    const [showRange, setShowPageRange] = useState<showrange>({ start: 0, end: SCROLL_VIEW_HEIGHT / ITEM_HEIGHT });

    useEffect(() => {
        createListData();
    }, []);
    /**
     * 创建列表显示数据
     */
    const createListData = () => {
        const initnalList: number[] = Array.from(Array(100).keys());
        setSourceData(initnalList);
    };



    // 源数据总长度
    const scrollViewHeight = useMemo(() => {
        return sourceData.length * ITEM_HEIGHT;
    }, [sourceData]);
    // 展示的数据列表
    const currentViewList = useMemo(() => {
        return sourceData.slice(showRange.start, showRange.end).map((el, index) => ({
            data: el,
            index,
        }));
    }, [showRange, sourceData]);

    // 计算当前列表顶部偏移量
    const scrollViewOffset = useMemo(() => {
        // console.log(showRange.start, "showRange.start");
        return showRange.start * ITEM_HEIGHT;
    }, [showRange.start]);

    // 触发滚动事件 去修改展示范围
    function onContainerScroll() {
        console.log(showRange.end);
        // 触底发请求请求新数据
        if (reachScrollBottom()) {
            let endIndex = showRange.end;
            let pushData: number[] = [];
            for (let index = 0; index < 20; index++) {
                pushData.push(endIndex++);
            }
            setSourceData((arr) => {
                return [...arr, ...pushData];
            });



        }
        calculateRange();
    }
    // 判断是否滚到底部
    function reachScrollBottom(): boolean {
        if (showRange.end >= sourceData.length) {
            return true
        }
        return false
    }

    /**
 * 计算元素范围
 */
    const calculateRange = () => {
        const element = containerRef.current;
        if (element) {
            // 当前上方有多少个元素
            const offset: number = Math.floor(element.scrollTop / ITEM_HEIGHT) + 1;
            // console.log(offset, "offset");
            // 可视区域能装下的元素个数
            const viewItemSize: number = Math.ceil(element.clientHeight / ITEM_HEIGHT);
            // 用上方看不到的元素数量减去上方需要预渲染的元素数量 就是实际需要渲染的起始点
            const startSize: number = offset - PRE_LOAD_COUNT;
            // 用上方看不见的元素数量 加可视区域展示的元素数量 再加下方需要预渲染的元素数量 即为实际需要渲染的底部
            const endSize: number = viewItemSize + offset + PRE_LOAD_COUNT;
            // 更新渲染范围
            setShowPageRange({
                start: startSize < 0 ? 0 : startSize,
                end: endSize > sourceData.length ? sourceData.length : endSize,
            });
        }
    };


    return (
        <div
            ref={containerRef}
            style={{
                height: 500,
                overflow: "auto",
            }}
            onScroll={onContainerScroll}
        >
            <div
                style={{
                    width: "100%",
                    height: scrollViewHeight - scrollViewOffset,
                    marginTop: scrollViewOffset,
                }}
            >
                {currentViewList.map((e) => (
                    <div
                        style={{
                            height: ITEM_HEIGHT
                        }}
                        className="showElement"
                        key={e.data}
                    >
                        Current Position: {e.data}
                    </div>
                ))}

            </div>
        </div>

    )
}
