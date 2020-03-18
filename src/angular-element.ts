/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

import {UpdatingElement, PropertyValues} from 'lit-element/lib/updating-element.js';
import {ɵdetectChanges as detectChanges, ɵrenderComponent as renderComponent, RendererType2} from '@angular/core';
export * from 'lit-element';

const rendererFactory = {
  createRenderer(hostElement: HTMLElement, rendererType: RendererType2 | null) {
    console.log('createRenderer', hostElement, rendererType);
    return {
      createComment(data: string): Comment {
        return document.createComment(data);
      },
      createElement(tagName: string): HTMLElement {
        return document.createElement(tagName);
      },
      createElementNS(namespace: string, tagName: string): HTMLElement {
        return document.createElementNS(namespace, tagName) as HTMLElement;
      },
      createTextNode(data: string): Text {
        return document.createTextNode(data);
      },
      querySelector(selectors: string): HTMLElement | null {
        // TODO: query the shadow root
        return document.querySelector(selectors);
      },
    };
  },
  begin() {
    console.log('begin');
  },
  end() {
    console.log('end');
  },
};

export class AngularElement extends UpdatingElement {

  private __ngRendered = false;

  protected update(changedProperties: PropertyValues) {
    super.update(changedProperties);
    if (!this.__ngRendered) {
      const ngComponentDef = (this.constructor as any).ngComponentDef;
      const factory = ngComponentDef.factory;
      ngComponentDef.factory = () => this;
      renderComponent(this.constructor as any, {host: this, rendererFactory});
      this.__ngRendered = true;
      ngComponentDef.factory = factory;
    }
    detectChanges(this);
  }
}
