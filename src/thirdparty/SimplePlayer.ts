export type EventCB = () => number
export class SimplePlayer {
  
  private _schedule: {
    delay: number
    event: EventCB
  }[] = []
  
  private _stopCb?: () => void

  public addEvent (delay: number, cb: EventCB) {
    this._schedule.push({
      delay,
      event: cb
    })
  }

  private _timer?: number
  private _stateTime?: number
  public start () {
    this._schedule.sort((a, b) => a.delay - b.delay)
    this._stateTime = new Date().getTime()
    while (this._schedule[0].delay < 0) {
      const head = this._schedule.shift()
      head!.event()
    }
    const res = new Promise((res) => {
      this._stopCb = res
    })
    this.tick()

    return res
  }

  public stop () {
    this._stopCb = undefined
    window.clearTimeout(this._timer)
    this._schedule = []
  }

  private tick () {
    if (this._schedule.length === 0) return
    const head = this._schedule.shift()
    this._timer = window.setTimeout(() => {
      const duration = head!.event()
      if (this._schedule.length === 0) {
        if (this._stopCb) {
          window.setTimeout(this._stopCb!, duration * 1000)
        }
      }
      this.tick()
    }, this._stateTime! + head!.delay * 1000 - new Date().getTime());
  }
}