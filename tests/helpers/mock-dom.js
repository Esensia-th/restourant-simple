/**
 * Minimal mock DOM untuk pengujian unit UI tanpa dependensi npm tambahan (jsdom/happy-dom).
 */

class MockElement {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.className = '';
    this.classList = {
      contains: (cls) => this.className.split(/\s+/).includes(cls),
      add: (cls) => {
        if (!this.classList.contains(cls)) {
          this.className = this.className ? `${this.className} ${cls}` : cls;
        }
      },
    };
    this.attributes = {};
    this.children = [];
    this.textContent = '';
    this._listeners = {};
    this.type = '';
    return new Proxy(this, {
      set(target, prop, value) {
        target[prop] = value;
        if (typeof prop === 'string') {
          target.attributes[prop] = String(value);
        }
        return true;
      },
      get(target, prop) {
        if (prop in target) return target[prop];
        return target.attributes[prop] ?? undefined;
      },
    });
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }

  getAttribute(name) {
    return this.attributes[name] ?? null;
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  addEventListener(event, handler) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(handler);
  }

  click() {
    if (this._listeners['click']) {
      for (const listener of this._listeners['click']) {
        listener();
      }
    }
  }

  querySelector(selector) {
    if (selector.startsWith('.')) {
      const cls = selector.slice(1);
      if (this.classList.contains(cls)) return this;
      for (const child of this.children) {
        const found = child.querySelector(selector);
        if (found) return found;
      }
    } else if (selector.startsWith('[') && selector.endsWith(']')) {
      const match = selector.match(/\[([a-zA-Z0-9_-]+)="([^"]+)"\]/);
      if (match) {
        const [, attr, val] = match;
        if (this.getAttribute(attr) === val) return this;
        for (const child of this.children) {
          const found = child.querySelector(selector);
          if (found) return found;
        }
      }
    }
    return null;
  }
}

export function setupMockDocument() {
  const originalDocument = globalThis.document;
  globalThis.document = {
    createElement(tagName) {
      return new MockElement(tagName);
    },
  };

  return () => {
    globalThis.document = originalDocument;
  };
}
