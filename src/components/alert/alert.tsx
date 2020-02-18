import { Component, Event, EventEmitter, Prop, Watch, h } from '@stencil/core';

/**
 * @slot - The alert's content.
 * @slot icon - An icon to show in the alert.
 */

@Component({
  tag: 'sl-alert',
  styleUrl: 'alert.scss',
  shadow: true
})
export class Tab {
  alert: HTMLElement;

  constructor() {
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
  }

  /** The type of alert to draw. */
  @Prop() type = 'primary';

  /** Set to true to make the alert closable. */
  @Prop() closable = false;

  /** Set to true to close the alert. */
  @Prop({ mutable: true }) closed = false;

  /** Emitted when the alert is closed. */
  @Event() slClose: EventEmitter;

  @Watch('closed')
  handleClosedChange() {
    // Remove the hidden attribute so the transition can run
    this.alert.removeAttribute('hidden');

    if (this.closed) {
      this.slClose.emit();
    }
  }

  handleTransitionEnd() {
    // Hide the alert when the transition ends
    if (this.closed) {
      this.alert.setAttribute('hidden', 'true');
    }
  }

  render() {
    return (
      <div
        ref={el => (this.alert = el)}
        class={{
          'sl-alert': true,
          'sl-alert--closed': this.closed,

          // States
          'sl-alert--primary': this.type === 'primary',
          'sl-alert--success': this.type === 'success',
          'sl-alert--info': this.type === 'info',
          'sl-alert--warning': this.type === 'warning',
          'sl-alert--danger': this.type === 'danger'
        }}
        role="alert"
        aria-hidden={this.closed}
        onTransitionEnd={this.handleTransitionEnd}
      >
        <span class="sl-alert__icon">
          <slot name="icon" />
        </span>

        <span class="sl-alert__body">
          <slot />
        </span>

        {this.closable && (
          <button type="button" class="sl-alert__close" onClick={() => (this.closed = true)}>
            <svg
              viewBox="0 0 16 16"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
                <g stroke="currentColor" stroke-width="2">
                  <path d="M3.5,12.5 L12.3466797,3.65332031"></path>
                  <path
                    d="M3.5,12.5 L12.3466797,3.65332031"
                    transform="translate(8.000000, 8.000000) scale(-1, 1) translate(-8.000000, -8.000000) "
                  ></path>
                </g>
              </g>
            </svg>
          </button>
        )}
      </div>
    );
  }
}
