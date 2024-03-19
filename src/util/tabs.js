    export const findMaxOrder = (tabsOpened) => {
        let max = 0
        for (let t of tabsOpened) {
            if (t.order > max) {
                max = t.order
            }
        }
        return max
    }

    const findMinOrder = (tabsOpened) => {
        let min = 100000
        for (let t of tabsOpened) {
            if (t.order < min) {
                min = t.order
            }
        }
        return min
    }

    const findMinOrderAfter = (tabsOpened, limit) => {
        let min = 100000
        for (let t of tabsOpened) {
            if (t.order < min && t.order > limit) {
                min = t.order
            }
        }
        return min
    }

    const orderDownByIf = (tabsOpened, limit, by) => {
        for (let t of tabsOpened) {
            if (t.order > limit) {
                t.order -= by
            }
        }
    }

    export const recountOrders = (tabsOpened) => {
        let target = 1
        let by = findMinOrder(tabsOpened) - target
        for (let i=0;i<tabsOpened.length;i++) {
            orderDownByIf(tabsOpened,target, by)
            target++
            by = findMinOrderAfter(tabsOpened,target-1) - target
        }
        
    }