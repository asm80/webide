// https://stackoverflow.com/questions/64959908/svelte-component-onload


export const createLoadObserver = handler => {
    let waiting = 0
  
    const onload = el => {
        waiting++
        el.addEventListener('load', () => {
            waiting--
            if (waiting === 0) {
                handler()
            }
        })
    }
    
    return onload
  }


/*

Usage: 
<script>
    import { createLoadObserver } from './util.js'
    
    const onload = createLoadObserver(() => {
        console.log('loaded!!!')
    })
</script>

<img use:onload src="https://place-hold.it/320x120" alt="placeholder" />

<img use:onload src="https://place-hold.it/120x320" alt="placeholder" />

*/