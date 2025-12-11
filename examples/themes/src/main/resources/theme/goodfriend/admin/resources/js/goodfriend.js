const w = /* @__PURE__ */ Object.create(null);
w.open = "0";
w.close = "1";
w.ping = "2";
w.pong = "3";
w.message = "4";
w.upgrade = "5";
w.noop = "6";
const S = /* @__PURE__ */ Object.create(null);
Object.keys(w).forEach((i) => {
  S[w[i]] = i;
});
const U = { type: "error", data: "parser error" }, te = typeof Blob == "function" || typeof Blob < "u" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]", se = typeof ArrayBuffer == "function", ie = (i) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(i) : i && i.buffer instanceof ArrayBuffer, H = ({ type: i, data: e }, t, s) => te && e instanceof Blob ? t ? s(e) : J(e, s) : se && (e instanceof ArrayBuffer || ie(e)) ? t ? s(e) : J(new Blob([e]), s) : s(w[i] + (e || "")), J = (i, e) => {
  const t = new FileReader();
  return t.onload = function() {
    const s = t.result.split(",")[1];
    e("b" + (s || ""));
  }, t.readAsDataURL(i);
};
function X(i) {
  return i instanceof Uint8Array ? i : i instanceof ArrayBuffer ? new Uint8Array(i) : new Uint8Array(i.buffer, i.byteOffset, i.byteLength);
}
let F;
function pe(i, e) {
  if (te && i.data instanceof Blob)
    return i.data.arrayBuffer().then(X).then(e);
  if (se && (i.data instanceof ArrayBuffer || ie(i.data)))
    return e(X(i.data));
  H(i, !1, (t) => {
    F || (F = new TextEncoder()), e(F.encode(t));
  });
}
const Q = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", R = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
for (let i = 0; i < Q.length; i++)
  R[Q.charCodeAt(i)] = i;
const ge = (i) => {
  let e = i.length * 0.75, t = i.length, s, n = 0, r, o, a, h;
  i[i.length - 1] === "=" && (e--, i[i.length - 2] === "=" && e--);
  const g = new ArrayBuffer(e), l = new Uint8Array(g);
  for (s = 0; s < t; s += 4)
    r = R[i.charCodeAt(s)], o = R[i.charCodeAt(s + 1)], a = R[i.charCodeAt(s + 2)], h = R[i.charCodeAt(s + 3)], l[n++] = r << 2 | o >> 4, l[n++] = (o & 15) << 4 | a >> 2, l[n++] = (a & 3) << 6 | h & 63;
  return g;
}, me = typeof ArrayBuffer == "function", z = (i, e) => {
  if (typeof i != "string")
    return {
      type: "message",
      data: ne(i, e)
    };
  const t = i.charAt(0);
  return t === "b" ? {
    type: "message",
    data: ye(i.substring(1), e)
  } : S[t] ? i.length > 1 ? {
    type: S[t],
    data: i.substring(1)
  } : {
    type: S[t]
  } : U;
}, ye = (i, e) => {
  if (me) {
    const t = ge(i);
    return ne(t, e);
  } else
    return { base64: !0, data: i };
}, ne = (i, e) => {
  switch (e) {
    case "blob":
      return i instanceof Blob ? i : new Blob([i]);
    case "arraybuffer":
    default:
      return i instanceof ArrayBuffer ? i : i.buffer;
  }
}, re = "", _e = (i, e) => {
  const t = i.length, s = new Array(t);
  let n = 0;
  i.forEach((r, o) => {
    H(r, !1, (a) => {
      s[o] = a, ++n === t && e(s.join(re));
    });
  });
}, be = (i, e) => {
  const t = i.split(re), s = [];
  for (let n = 0; n < t.length; n++) {
    const r = z(t[n], e);
    if (s.push(r), r.type === "error")
      break;
  }
  return s;
};
function we() {
  return new TransformStream({
    transform(i, e) {
      pe(i, (t) => {
        const s = t.length;
        let n;
        if (s < 126)
          n = new Uint8Array(1), new DataView(n.buffer).setUint8(0, s);
        else if (s < 65536) {
          n = new Uint8Array(3);
          const r = new DataView(n.buffer);
          r.setUint8(0, 126), r.setUint16(1, s);
        } else {
          n = new Uint8Array(9);
          const r = new DataView(n.buffer);
          r.setUint8(0, 127), r.setBigUint64(1, BigInt(s));
        }
        i.data && typeof i.data != "string" && (n[0] |= 128), e.enqueue(n), e.enqueue(t);
      });
    }
  });
}
let q;
function T(i) {
  return i.reduce((e, t) => e + t.length, 0);
}
function A(i, e) {
  if (i[0].length === e)
    return i.shift();
  const t = new Uint8Array(e);
  let s = 0;
  for (let n = 0; n < e; n++)
    t[n] = i[0][s++], s === i[0].length && (i.shift(), s = 0);
  return i.length && s < i[0].length && (i[0] = i[0].slice(s)), t;
}
function ve(i, e) {
  q || (q = new TextDecoder());
  const t = [];
  let s = 0, n = -1, r = !1;
  return new TransformStream({
    transform(o, a) {
      for (t.push(o); ; ) {
        if (s === 0) {
          if (T(t) < 1)
            break;
          const h = A(t, 1);
          r = (h[0] & 128) === 128, n = h[0] & 127, n < 126 ? s = 3 : n === 126 ? s = 1 : s = 2;
        } else if (s === 1) {
          if (T(t) < 2)
            break;
          const h = A(t, 2);
          n = new DataView(h.buffer, h.byteOffset, h.length).getUint16(0), s = 3;
        } else if (s === 2) {
          if (T(t) < 8)
            break;
          const h = A(t, 8), g = new DataView(h.buffer, h.byteOffset, h.length), l = g.getUint32(0);
          if (l > Math.pow(2, 21) - 1) {
            a.enqueue(U);
            break;
          }
          n = l * Math.pow(2, 32) + g.getUint32(4), s = 3;
        } else {
          if (T(t) < n)
            break;
          const h = A(t, n);
          a.enqueue(z(r ? h : q.decode(h), e)), s = 0;
        }
        if (n === 0 || n > i) {
          a.enqueue(U);
          break;
        }
      }
    }
  });
}
const oe = 4;
function u(i) {
  if (i) return Ee(i);
}
function Ee(i) {
  for (var e in u.prototype)
    i[e] = u.prototype[e];
  return i;
}
u.prototype.on = u.prototype.addEventListener = function(i, e) {
  return this._callbacks = this._callbacks || {}, (this._callbacks["$" + i] = this._callbacks["$" + i] || []).push(e), this;
};
u.prototype.once = function(i, e) {
  function t() {
    this.off(i, t), e.apply(this, arguments);
  }
  return t.fn = e, this.on(i, t), this;
};
u.prototype.off = u.prototype.removeListener = u.prototype.removeAllListeners = u.prototype.removeEventListener = function(i, e) {
  if (this._callbacks = this._callbacks || {}, arguments.length == 0)
    return this._callbacks = {}, this;
  var t = this._callbacks["$" + i];
  if (!t) return this;
  if (arguments.length == 1)
    return delete this._callbacks["$" + i], this;
  for (var s, n = 0; n < t.length; n++)
    if (s = t[n], s === e || s.fn === e) {
      t.splice(n, 1);
      break;
    }
  return t.length === 0 && delete this._callbacks["$" + i], this;
};
u.prototype.emit = function(i) {
  this._callbacks = this._callbacks || {};
  for (var e = new Array(arguments.length - 1), t = this._callbacks["$" + i], s = 1; s < arguments.length; s++)
    e[s - 1] = arguments[s];
  if (t) {
    t = t.slice(0);
    for (var s = 0, n = t.length; s < n; ++s)
      t[s].apply(this, e);
  }
  return this;
};
u.prototype.emitReserved = u.prototype.emit;
u.prototype.listeners = function(i) {
  return this._callbacks = this._callbacks || {}, this._callbacks["$" + i] || [];
};
u.prototype.hasListeners = function(i) {
  return !!this.listeners(i).length;
};
const L = typeof Promise == "function" && typeof Promise.resolve == "function" ? (e) => Promise.resolve().then(e) : (e, t) => t(e, 0), p = typeof self < "u" ? self : typeof window < "u" ? window : Function("return this")(), ke = "arraybuffer";
function ae(i, ...e) {
  return e.reduce((t, s) => (i.hasOwnProperty(s) && (t[s] = i[s]), t), {});
}
const xe = p.setTimeout, Ce = p.clearTimeout;
function P(i, e) {
  e.useNativeTimers ? (i.setTimeoutFn = xe.bind(p), i.clearTimeoutFn = Ce.bind(p)) : (i.setTimeoutFn = p.setTimeout.bind(p), i.clearTimeoutFn = p.clearTimeout.bind(p));
}
const Re = 1.33;
function Te(i) {
  return typeof i == "string" ? Ae(i) : Math.ceil((i.byteLength || i.size) * Re);
}
function Ae(i) {
  let e = 0, t = 0;
  for (let s = 0, n = i.length; s < n; s++)
    e = i.charCodeAt(s), e < 128 ? t += 1 : e < 2048 ? t += 2 : e < 55296 || e >= 57344 ? t += 3 : (s++, t += 4);
  return t;
}
function ce() {
  return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}
function Se(i) {
  let e = "";
  for (let t in i)
    i.hasOwnProperty(t) && (e.length && (e += "&"), e += encodeURIComponent(t) + "=" + encodeURIComponent(i[t]));
  return e;
}
function Oe(i) {
  let e = {}, t = i.split("&");
  for (let s = 0, n = t.length; s < n; s++) {
    let r = t[s].split("=");
    e[decodeURIComponent(r[0])] = decodeURIComponent(r[1]);
  }
  return e;
}
class Be extends Error {
  constructor(e, t, s) {
    super(e), this.description = t, this.context = s, this.type = "TransportError";
  }
}
class W extends u {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(e) {
    super(), this.writable = !1, P(this, e), this.opts = e, this.query = e.query, this.socket = e.socket, this.supportsBinary = !e.forceBase64;
  }
  /**
   * Emits an error.
   *
   * @param {String} reason
   * @param description
   * @param context - the error context
   * @return {Transport} for chaining
   * @protected
   */
  onError(e, t, s) {
    return super.emitReserved("error", new Be(e, t, s)), this;
  }
  /**
   * Opens the transport.
   */
  open() {
    return this.readyState = "opening", this.doOpen(), this;
  }
  /**
   * Closes the transport.
   */
  close() {
    return (this.readyState === "opening" || this.readyState === "open") && (this.doClose(), this.onClose()), this;
  }
  /**
   * Sends multiple packets.
   *
   * @param {Array} packets
   */
  send(e) {
    this.readyState === "open" && this.write(e);
  }
  /**
   * Called upon open
   *
   * @protected
   */
  onOpen() {
    this.readyState = "open", this.writable = !0, super.emitReserved("open");
  }
  /**
   * Called with data.
   *
   * @param {String} data
   * @protected
   */
  onData(e) {
    const t = z(e, this.socket.binaryType);
    this.onPacket(t);
  }
  /**
   * Called with a decoded packet.
   *
   * @protected
   */
  onPacket(e) {
    super.emitReserved("packet", e);
  }
  /**
   * Called upon close.
   *
   * @protected
   */
  onClose(e) {
    this.readyState = "closed", super.emitReserved("close", e);
  }
  /**
   * Pauses the transport, in order not to lose packets during an upgrade.
   *
   * @param onPause
   */
  pause(e) {
  }
  createUri(e, t = {}) {
    return e + "://" + this._hostname() + this._port() + this.opts.path + this._query(t);
  }
  _hostname() {
    const e = this.opts.hostname;
    return e.indexOf(":") === -1 ? e : "[" + e + "]";
  }
  _port() {
    return this.opts.port && (this.opts.secure && +(this.opts.port !== 443) || !this.opts.secure && Number(this.opts.port) !== 80) ? ":" + this.opts.port : "";
  }
  _query(e) {
    const t = Se(e);
    return t.length ? "?" + t : "";
  }
}
class Ne extends W {
  constructor() {
    super(...arguments), this._polling = !1;
  }
  get name() {
    return "polling";
  }
  /**
   * Opens the socket (triggers polling). We write a PING message to determine
   * when the transport is open.
   *
   * @protected
   */
  doOpen() {
    this._poll();
  }
  /**
   * Pauses polling.
   *
   * @param {Function} onPause - callback upon buffers are flushed and transport is paused
   * @package
   */
  pause(e) {
    this.readyState = "pausing";
    const t = () => {
      this.readyState = "paused", e();
    };
    if (this._polling || !this.writable) {
      let s = 0;
      this._polling && (s++, this.once("pollComplete", function() {
        --s || t();
      })), this.writable || (s++, this.once("drain", function() {
        --s || t();
      }));
    } else
      t();
  }
  /**
   * Starts polling cycle.
   *
   * @private
   */
  _poll() {
    this._polling = !0, this.doPoll(), this.emitReserved("poll");
  }
  /**
   * Overloads onData to detect payloads.
   *
   * @protected
   */
  onData(e) {
    const t = (s) => {
      if (this.readyState === "opening" && s.type === "open" && this.onOpen(), s.type === "close")
        return this.onClose({ description: "transport closed by the server" }), !1;
      this.onPacket(s);
    };
    be(e, this.socket.binaryType).forEach(t), this.readyState !== "closed" && (this._polling = !1, this.emitReserved("pollComplete"), this.readyState === "open" && this._poll());
  }
  /**
   * For polling, send a close packet.
   *
   * @protected
   */
  doClose() {
    const e = () => {
      this.write([{ type: "close" }]);
    };
    this.readyState === "open" ? e() : this.once("open", e);
  }
  /**
   * Writes a packets payload.
   *
   * @param {Array} packets - data packets
   * @protected
   */
  write(e) {
    this.writable = !1, _e(e, (t) => {
      this.doWrite(t, () => {
        this.writable = !0, this.emitReserved("drain");
      });
    });
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const e = this.opts.secure ? "https" : "http", t = this.query || {};
    return this.opts.timestampRequests !== !1 && (t[this.opts.timestampParam] = ce()), !this.supportsBinary && !t.sid && (t.b64 = 1), this.createUri(e, t);
  }
}
let he = !1;
try {
  he = typeof XMLHttpRequest < "u" && "withCredentials" in new XMLHttpRequest();
} catch {
}
const Le = he;
function Pe() {
}
class Fe extends Ne {
  /**
   * XHR Polling constructor.
   *
   * @param {Object} opts
   * @package
   */
  constructor(e) {
    if (super(e), typeof location < "u") {
      const t = location.protocol === "https:";
      let s = location.port;
      s || (s = t ? "443" : "80"), this.xd = typeof location < "u" && e.hostname !== location.hostname || s !== e.port;
    }
  }
  /**
   * Sends data.
   *
   * @param {String} data to send.
   * @param {Function} called upon flush.
   * @private
   */
  doWrite(e, t) {
    const s = this.request({
      method: "POST",
      data: e
    });
    s.on("success", t), s.on("error", (n, r) => {
      this.onError("xhr post error", n, r);
    });
  }
  /**
   * Starts a poll cycle.
   *
   * @private
   */
  doPoll() {
    const e = this.request();
    e.on("data", this.onData.bind(this)), e.on("error", (t, s) => {
      this.onError("xhr poll error", t, s);
    }), this.pollXhr = e;
  }
}
class b extends u {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(e, t, s) {
    super(), this.createRequest = e, P(this, s), this._opts = s, this._method = s.method || "GET", this._uri = t, this._data = s.data !== void 0 ? s.data : null, this._create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  _create() {
    var e;
    const t = ae(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    t.xdomain = !!this._opts.xd;
    const s = this._xhr = this.createRequest(t);
    try {
      s.open(this._method, this._uri, !0);
      try {
        if (this._opts.extraHeaders) {
          s.setDisableHeaderCheck && s.setDisableHeaderCheck(!0);
          for (let n in this._opts.extraHeaders)
            this._opts.extraHeaders.hasOwnProperty(n) && s.setRequestHeader(n, this._opts.extraHeaders[n]);
        }
      } catch {
      }
      if (this._method === "POST")
        try {
          s.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch {
        }
      try {
        s.setRequestHeader("Accept", "*/*");
      } catch {
      }
      (e = this._opts.cookieJar) === null || e === void 0 || e.addCookies(s), "withCredentials" in s && (s.withCredentials = this._opts.withCredentials), this._opts.requestTimeout && (s.timeout = this._opts.requestTimeout), s.onreadystatechange = () => {
        var n;
        s.readyState === 3 && ((n = this._opts.cookieJar) === null || n === void 0 || n.parseCookies(
          // @ts-ignore
          s.getResponseHeader("set-cookie")
        )), s.readyState === 4 && (s.status === 200 || s.status === 1223 ? this._onLoad() : this.setTimeoutFn(() => {
          this._onError(typeof s.status == "number" ? s.status : 0);
        }, 0));
      }, s.send(this._data);
    } catch (n) {
      this.setTimeoutFn(() => {
        this._onError(n);
      }, 0);
      return;
    }
    typeof document < "u" && (this._index = b.requestsCount++, b.requests[this._index] = this);
  }
  /**
   * Called upon error.
   *
   * @private
   */
  _onError(e) {
    this.emitReserved("error", e, this._xhr), this._cleanup(!0);
  }
  /**
   * Cleans up house.
   *
   * @private
   */
  _cleanup(e) {
    if (!(typeof this._xhr > "u" || this._xhr === null)) {
      if (this._xhr.onreadystatechange = Pe, e)
        try {
          this._xhr.abort();
        } catch {
        }
      typeof document < "u" && delete b.requests[this._index], this._xhr = null;
    }
  }
  /**
   * Called upon load.
   *
   * @private
   */
  _onLoad() {
    const e = this._xhr.responseText;
    e !== null && (this.emitReserved("data", e), this.emitReserved("success"), this._cleanup());
  }
  /**
   * Aborts the request.
   *
   * @package
   */
  abort() {
    this._cleanup();
  }
}
b.requestsCount = 0;
b.requests = {};
if (typeof document < "u") {
  if (typeof attachEvent == "function")
    attachEvent("onunload", j);
  else if (typeof addEventListener == "function") {
    const i = "onpagehide" in p ? "pagehide" : "unload";
    addEventListener(i, j, !1);
  }
}
function j() {
  for (let i in b.requests)
    b.requests.hasOwnProperty(i) && b.requests[i].abort();
}
const qe = function() {
  const i = ue({
    xdomain: !1
  });
  return i && i.responseType !== null;
}();
class De extends Fe {
  constructor(e) {
    super(e);
    const t = e && e.forceBase64;
    this.supportsBinary = qe && !t;
  }
  request(e = {}) {
    return Object.assign(e, { xd: this.xd }, this.opts), new b(ue, this.uri(), e);
  }
}
function ue(i) {
  const e = i.xdomain;
  try {
    if (typeof XMLHttpRequest < "u" && (!e || Le))
      return new XMLHttpRequest();
  } catch {
  }
  if (!e)
    try {
      return new p[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch {
    }
}
const le = typeof navigator < "u" && typeof navigator.product == "string" && navigator.product.toLowerCase() === "reactnative";
class Ue extends W {
  get name() {
    return "websocket";
  }
  doOpen() {
    const e = this.uri(), t = this.opts.protocols, s = le ? {} : ae(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    this.opts.extraHeaders && (s.headers = this.opts.extraHeaders);
    try {
      this.ws = this.createSocket(e, t, s);
    } catch (n) {
      return this.emitReserved("error", n);
    }
    this.ws.binaryType = this.socket.binaryType, this.addEventListeners();
  }
  /**
   * Adds event listeners to the socket
   *
   * @private
   */
  addEventListeners() {
    this.ws.onopen = () => {
      this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
    }, this.ws.onclose = (e) => this.onClose({
      description: "websocket connection closed",
      context: e
    }), this.ws.onmessage = (e) => this.onData(e.data), this.ws.onerror = (e) => this.onError("websocket error", e);
  }
  write(e) {
    this.writable = !1;
    for (let t = 0; t < e.length; t++) {
      const s = e[t], n = t === e.length - 1;
      H(s, this.supportsBinary, (r) => {
        try {
          this.doWrite(s, r);
        } catch {
        }
        n && L(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    typeof this.ws < "u" && (this.ws.onerror = () => {
    }, this.ws.close(), this.ws = null);
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const e = this.opts.secure ? "wss" : "ws", t = this.query || {};
    return this.opts.timestampRequests && (t[this.opts.timestampParam] = ce()), this.supportsBinary || (t.b64 = 1), this.createUri(e, t);
  }
}
const D = p.WebSocket || p.MozWebSocket;
class Ie extends Ue {
  createSocket(e, t, s) {
    return le ? new D(e, t, s) : t ? new D(e, t) : new D(e);
  }
  doWrite(e, t) {
    this.ws.send(t);
  }
}
class Me extends W {
  get name() {
    return "webtransport";
  }
  doOpen() {
    try {
      this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
    } catch (e) {
      return this.emitReserved("error", e);
    }
    this._transport.closed.then(() => {
      this.onClose();
    }).catch((e) => {
      this.onError("webtransport error", e);
    }), this._transport.ready.then(() => {
      this._transport.createBidirectionalStream().then((e) => {
        const t = ve(Number.MAX_SAFE_INTEGER, this.socket.binaryType), s = e.readable.pipeThrough(t).getReader(), n = we();
        n.readable.pipeTo(e.writable), this._writer = n.writable.getWriter();
        const r = () => {
          s.read().then(({ done: a, value: h }) => {
            a || (this.onPacket(h), r());
          }).catch((a) => {
          });
        };
        r();
        const o = { type: "open" };
        this.query.sid && (o.data = `{"sid":"${this.query.sid}"}`), this._writer.write(o).then(() => this.onOpen());
      });
    });
  }
  write(e) {
    this.writable = !1;
    for (let t = 0; t < e.length; t++) {
      const s = e[t], n = t === e.length - 1;
      this._writer.write(s).then(() => {
        n && L(() => {
          this.writable = !0, this.emitReserved("drain");
        }, this.setTimeoutFn);
      });
    }
  }
  doClose() {
    var e;
    (e = this._transport) === null || e === void 0 || e.close();
  }
}
const Ve = {
  websocket: Ie,
  webtransport: Me,
  polling: De
}, $e = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/, Ge = [
  "source",
  "protocol",
  "authority",
  "userInfo",
  "user",
  "password",
  "host",
  "port",
  "relative",
  "path",
  "directory",
  "file",
  "query",
  "anchor"
];
function I(i) {
  if (i.length > 8e3)
    throw "URI too long";
  const e = i, t = i.indexOf("["), s = i.indexOf("]");
  t != -1 && s != -1 && (i = i.substring(0, t) + i.substring(t, s).replace(/:/g, ";") + i.substring(s, i.length));
  let n = $e.exec(i || ""), r = {}, o = 14;
  for (; o--; )
    r[Ge[o]] = n[o] || "";
  return t != -1 && s != -1 && (r.source = e, r.host = r.host.substring(1, r.host.length - 1).replace(/;/g, ":"), r.authority = r.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), r.ipv6uri = !0), r.pathNames = He(r, r.path), r.queryKey = ze(r, r.query), r;
}
function He(i, e) {
  const t = /\/{2,9}/g, s = e.replace(t, "/").split("/");
  return (e.slice(0, 1) == "/" || e.length === 0) && s.splice(0, 1), e.slice(-1) == "/" && s.splice(s.length - 1, 1), s;
}
function ze(i, e) {
  const t = {};
  return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(s, n, r) {
    n && (t[n] = r);
  }), t;
}
const M = typeof addEventListener == "function" && typeof removeEventListener == "function", O = [];
M && addEventListener("offline", () => {
  O.forEach((i) => i());
}, !1);
class v extends u {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(e, t) {
    if (super(), this.binaryType = ke, this.writeBuffer = [], this._prevBufferLen = 0, this._pingInterval = -1, this._pingTimeout = -1, this._maxPayload = -1, this._pingTimeoutTime = 1 / 0, e && typeof e == "object" && (t = e, e = null), e) {
      const s = I(e);
      t.hostname = s.host, t.secure = s.protocol === "https" || s.protocol === "wss", t.port = s.port, s.query && (t.query = s.query);
    } else t.host && (t.hostname = I(t.host).host);
    P(this, t), this.secure = t.secure != null ? t.secure : typeof location < "u" && location.protocol === "https:", t.hostname && !t.port && (t.port = this.secure ? "443" : "80"), this.hostname = t.hostname || (typeof location < "u" ? location.hostname : "localhost"), this.port = t.port || (typeof location < "u" && location.port ? location.port : this.secure ? "443" : "80"), this.transports = [], this._transportsByName = {}, t.transports.forEach((s) => {
      const n = s.prototype.name;
      this.transports.push(n), this._transportsByName[n] = s;
    }), this.opts = Object.assign({
      path: "/engine.io",
      agent: !1,
      withCredentials: !1,
      upgrade: !0,
      timestampParam: "t",
      rememberUpgrade: !1,
      addTrailingSlash: !0,
      rejectUnauthorized: !0,
      perMessageDeflate: {
        threshold: 1024
      },
      transportOptions: {},
      closeOnBeforeunload: !1
    }, t), this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : ""), typeof this.opts.query == "string" && (this.opts.query = Oe(this.opts.query)), M && (this.opts.closeOnBeforeunload && (this._beforeunloadEventListener = () => {
      this.transport && (this.transport.removeAllListeners(), this.transport.close());
    }, addEventListener("beforeunload", this._beforeunloadEventListener, !1)), this.hostname !== "localhost" && (this._offlineEventListener = () => {
      this._onClose("transport close", {
        description: "network connection lost"
      });
    }, O.push(this._offlineEventListener))), this.opts.withCredentials && (this._cookieJar = void 0), this._open();
  }
  /**
   * Creates transport of the given type.
   *
   * @param {String} name - transport name
   * @return {Transport}
   * @private
   */
  createTransport(e) {
    const t = Object.assign({}, this.opts.query);
    t.EIO = oe, t.transport = e, this.id && (t.sid = this.id);
    const s = Object.assign({}, this.opts, {
      query: t,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    }, this.opts.transportOptions[e]);
    return new this._transportsByName[e](s);
  }
  /**
   * Initializes transport to use and starts probe.
   *
   * @private
   */
  _open() {
    if (this.transports.length === 0) {
      this.setTimeoutFn(() => {
        this.emitReserved("error", "No transports available");
      }, 0);
      return;
    }
    const e = this.opts.rememberUpgrade && v.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
    this.readyState = "opening";
    const t = this.createTransport(e);
    t.open(), this.setTransport(t);
  }
  /**
   * Sets the current transport. Disables the existing one (if any).
   *
   * @private
   */
  setTransport(e) {
    this.transport && this.transport.removeAllListeners(), this.transport = e, e.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (t) => this._onClose("transport close", t));
  }
  /**
   * Called when connection is deemed open.
   *
   * @private
   */
  onOpen() {
    this.readyState = "open", v.priorWebsocketSuccess = this.transport.name === "websocket", this.emitReserved("open"), this.flush();
  }
  /**
   * Handles a packet.
   *
   * @private
   */
  _onPacket(e) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing")
      switch (this.emitReserved("packet", e), this.emitReserved("heartbeat"), e.type) {
        case "open":
          this.onHandshake(JSON.parse(e.data));
          break;
        case "ping":
          this._sendPacket("pong"), this.emitReserved("ping"), this.emitReserved("pong"), this._resetPingTimeout();
          break;
        case "error":
          const t = new Error("server error");
          t.code = e.data, this._onError(t);
          break;
        case "message":
          this.emitReserved("data", e.data), this.emitReserved("message", e.data);
          break;
      }
  }
  /**
   * Called upon handshake completion.
   *
   * @param {Object} data - handshake obj
   * @private
   */
  onHandshake(e) {
    this.emitReserved("handshake", e), this.id = e.sid, this.transport.query.sid = e.sid, this._pingInterval = e.pingInterval, this._pingTimeout = e.pingTimeout, this._maxPayload = e.maxPayload, this.onOpen(), this.readyState !== "closed" && this._resetPingTimeout();
  }
  /**
   * Sets and resets ping timeout timer based on server pings.
   *
   * @private
   */
  _resetPingTimeout() {
    this.clearTimeoutFn(this._pingTimeoutTimer);
    const e = this._pingInterval + this._pingTimeout;
    this._pingTimeoutTime = Date.now() + e, this._pingTimeoutTimer = this.setTimeoutFn(() => {
      this._onClose("ping timeout");
    }, e), this.opts.autoUnref && this._pingTimeoutTimer.unref();
  }
  /**
   * Called on `drain` event
   *
   * @private
   */
  _onDrain() {
    this.writeBuffer.splice(0, this._prevBufferLen), this._prevBufferLen = 0, this.writeBuffer.length === 0 ? this.emitReserved("drain") : this.flush();
  }
  /**
   * Flush write buffers.
   *
   * @private
   */
  flush() {
    if (this.readyState !== "closed" && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
      const e = this._getWritablePackets();
      this.transport.send(e), this._prevBufferLen = e.length, this.emitReserved("flush");
    }
  }
  /**
   * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
   * long-polling)
   *
   * @private
   */
  _getWritablePackets() {
    if (!(this._maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1))
      return this.writeBuffer;
    let t = 1;
    for (let s = 0; s < this.writeBuffer.length; s++) {
      const n = this.writeBuffer[s].data;
      if (n && (t += Te(n)), s > 0 && t > this._maxPayload)
        return this.writeBuffer.slice(0, s);
      t += 2;
    }
    return this.writeBuffer;
  }
  /**
   * Checks whether the heartbeat timer has expired but the socket has not yet been notified.
   *
   * Note: this method is private for now because it does not really fit the WebSocket API, but if we put it in the
   * `write()` method then the message would not be buffered by the Socket.IO client.
   *
   * @return {boolean}
   * @private
   */
  /* private */
  _hasPingExpired() {
    if (!this._pingTimeoutTime)
      return !0;
    const e = Date.now() > this._pingTimeoutTime;
    return e && (this._pingTimeoutTime = 0, L(() => {
      this._onClose("ping timeout");
    }, this.setTimeoutFn)), e;
  }
  /**
   * Sends a message.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  write(e, t, s) {
    return this._sendPacket("message", e, t, s), this;
  }
  /**
   * Sends a message. Alias of {@link Socket#write}.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  send(e, t, s) {
    return this._sendPacket("message", e, t, s), this;
  }
  /**
   * Sends a packet.
   *
   * @param {String} type: packet type.
   * @param {String} data.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @private
   */
  _sendPacket(e, t, s, n) {
    if (typeof t == "function" && (n = t, t = void 0), typeof s == "function" && (n = s, s = null), this.readyState === "closing" || this.readyState === "closed")
      return;
    s = s || {}, s.compress = s.compress !== !1;
    const r = {
      type: e,
      data: t,
      options: s
    };
    this.emitReserved("packetCreate", r), this.writeBuffer.push(r), n && this.once("flush", n), this.flush();
  }
  /**
   * Closes the connection.
   */
  close() {
    const e = () => {
      this._onClose("forced close"), this.transport.close();
    }, t = () => {
      this.off("upgrade", t), this.off("upgradeError", t), e();
    }, s = () => {
      this.once("upgrade", t), this.once("upgradeError", t);
    };
    return (this.readyState === "opening" || this.readyState === "open") && (this.readyState = "closing", this.writeBuffer.length ? this.once("drain", () => {
      this.upgrading ? s() : e();
    }) : this.upgrading ? s() : e()), this;
  }
  /**
   * Called upon transport error
   *
   * @private
   */
  _onError(e) {
    if (v.priorWebsocketSuccess = !1, this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening")
      return this.transports.shift(), this._open();
    this.emitReserved("error", e), this._onClose("transport error", e);
  }
  /**
   * Called upon transport close.
   *
   * @private
   */
  _onClose(e, t) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing") {
      if (this.clearTimeoutFn(this._pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), M && (this._beforeunloadEventListener && removeEventListener("beforeunload", this._beforeunloadEventListener, !1), this._offlineEventListener)) {
        const s = O.indexOf(this._offlineEventListener);
        s !== -1 && O.splice(s, 1);
      }
      this.readyState = "closed", this.id = null, this.emitReserved("close", e, t), this.writeBuffer = [], this._prevBufferLen = 0;
    }
  }
}
v.protocol = oe;
class We extends v {
  constructor() {
    super(...arguments), this._upgrades = [];
  }
  onOpen() {
    if (super.onOpen(), this.readyState === "open" && this.opts.upgrade)
      for (let e = 0; e < this._upgrades.length; e++)
        this._probe(this._upgrades[e]);
  }
  /**
   * Probes a transport.
   *
   * @param {String} name - transport name
   * @private
   */
  _probe(e) {
    let t = this.createTransport(e), s = !1;
    v.priorWebsocketSuccess = !1;
    const n = () => {
      s || (t.send([{ type: "ping", data: "probe" }]), t.once("packet", (d) => {
        if (!s)
          if (d.type === "pong" && d.data === "probe") {
            if (this.upgrading = !0, this.emitReserved("upgrading", t), !t)
              return;
            v.priorWebsocketSuccess = t.name === "websocket", this.transport.pause(() => {
              s || this.readyState !== "closed" && (l(), this.setTransport(t), t.send([{ type: "upgrade" }]), this.emitReserved("upgrade", t), t = null, this.upgrading = !1, this.flush());
            });
          } else {
            const f = new Error("probe error");
            f.transport = t.name, this.emitReserved("upgradeError", f);
          }
      }));
    };
    function r() {
      s || (s = !0, l(), t.close(), t = null);
    }
    const o = (d) => {
      const f = new Error("probe error: " + d);
      f.transport = t.name, r(), this.emitReserved("upgradeError", f);
    };
    function a() {
      o("transport closed");
    }
    function h() {
      o("socket closed");
    }
    function g(d) {
      t && d.name !== t.name && r();
    }
    const l = () => {
      t.removeListener("open", n), t.removeListener("error", o), t.removeListener("close", a), this.off("close", h), this.off("upgrading", g);
    };
    t.once("open", n), t.once("error", o), t.once("close", a), this.once("close", h), this.once("upgrading", g), this._upgrades.indexOf("webtransport") !== -1 && e !== "webtransport" ? this.setTimeoutFn(() => {
      s || t.open();
    }, 200) : t.open();
  }
  onHandshake(e) {
    this._upgrades = this._filterUpgrades(e.upgrades), super.onHandshake(e);
  }
  /**
   * Filters upgrades, returning only those matching client transports.
   *
   * @param {Array} upgrades - server upgrades
   * @private
   */
  _filterUpgrades(e) {
    const t = [];
    for (let s = 0; s < e.length; s++)
      ~this.transports.indexOf(e[s]) && t.push(e[s]);
    return t;
  }
}
let Ke = class extends We {
  constructor(e, t = {}) {
    const s = typeof e == "object" ? e : t;
    (!s.transports || s.transports && typeof s.transports[0] == "string") && (s.transports = (s.transports || ["polling", "websocket", "webtransport"]).map((n) => Ve[n]).filter((n) => !!n)), super(e, s);
  }
};
function Ye(i, e = "", t) {
  let s = i;
  t = t || typeof location < "u" && location, i == null && (i = t.protocol + "//" + t.host), typeof i == "string" && (i.charAt(0) === "/" && (i.charAt(1) === "/" ? i = t.protocol + i : i = t.host + i), /^(https?|wss?):\/\//.test(i) || (typeof t < "u" ? i = t.protocol + "//" + i : i = "https://" + i), s = I(i)), s.port || (/^(http|ws)$/.test(s.protocol) ? s.port = "80" : /^(http|ws)s$/.test(s.protocol) && (s.port = "443")), s.path = s.path || "/";
  const r = s.host.indexOf(":") !== -1 ? "[" + s.host + "]" : s.host;
  return s.id = s.protocol + "://" + r + ":" + s.port + e, s.href = s.protocol + "://" + r + (t && t.port === s.port ? "" : ":" + s.port), s;
}
const Je = typeof ArrayBuffer == "function", Xe = (i) => typeof ArrayBuffer.isView == "function" ? ArrayBuffer.isView(i) : i.buffer instanceof ArrayBuffer, de = Object.prototype.toString, Qe = typeof Blob == "function" || typeof Blob < "u" && de.call(Blob) === "[object BlobConstructor]", je = typeof File == "function" || typeof File < "u" && de.call(File) === "[object FileConstructor]";
function K(i) {
  return Je && (i instanceof ArrayBuffer || Xe(i)) || Qe && i instanceof Blob || je && i instanceof File;
}
function B(i, e) {
  if (!i || typeof i != "object")
    return !1;
  if (Array.isArray(i)) {
    for (let t = 0, s = i.length; t < s; t++)
      if (B(i[t]))
        return !0;
    return !1;
  }
  if (K(i))
    return !0;
  if (i.toJSON && typeof i.toJSON == "function" && arguments.length === 1)
    return B(i.toJSON(), !0);
  for (const t in i)
    if (Object.prototype.hasOwnProperty.call(i, t) && B(i[t]))
      return !0;
  return !1;
}
function Ze(i) {
  const e = [], t = i.data, s = i;
  return s.data = V(t, e), s.attachments = e.length, { packet: s, buffers: e };
}
function V(i, e) {
  if (!i)
    return i;
  if (K(i)) {
    const t = { _placeholder: !0, num: e.length };
    return e.push(i), t;
  } else if (Array.isArray(i)) {
    const t = new Array(i.length);
    for (let s = 0; s < i.length; s++)
      t[s] = V(i[s], e);
    return t;
  } else if (typeof i == "object" && !(i instanceof Date)) {
    const t = {};
    for (const s in i)
      Object.prototype.hasOwnProperty.call(i, s) && (t[s] = V(i[s], e));
    return t;
  }
  return i;
}
function et(i, e) {
  return i.data = $(i.data, e), delete i.attachments, i;
}
function $(i, e) {
  if (!i)
    return i;
  if (i && i._placeholder === !0) {
    if (typeof i.num == "number" && i.num >= 0 && i.num < e.length)
      return e[i.num];
    throw new Error("illegal attachments");
  } else if (Array.isArray(i))
    for (let t = 0; t < i.length; t++)
      i[t] = $(i[t], e);
  else if (typeof i == "object")
    for (const t in i)
      Object.prototype.hasOwnProperty.call(i, t) && (i[t] = $(i[t], e));
  return i;
}
const tt = [
  "connect",
  "connect_error",
  "disconnect",
  "disconnecting",
  "newListener",
  "removeListener"
  // used by the Node.js EventEmitter
], st = 5;
var c;
(function(i) {
  i[i.CONNECT = 0] = "CONNECT", i[i.DISCONNECT = 1] = "DISCONNECT", i[i.EVENT = 2] = "EVENT", i[i.ACK = 3] = "ACK", i[i.CONNECT_ERROR = 4] = "CONNECT_ERROR", i[i.BINARY_EVENT = 5] = "BINARY_EVENT", i[i.BINARY_ACK = 6] = "BINARY_ACK";
})(c || (c = {}));
class it {
  /**
   * Encoder constructor
   *
   * @param {function} replacer - custom replacer to pass down to JSON.parse
   */
  constructor(e) {
    this.replacer = e;
  }
  /**
   * Encode a packet as a single string if non-binary, or as a
   * buffer sequence, depending on packet type.
   *
   * @param {Object} obj - packet object
   */
  encode(e) {
    return (e.type === c.EVENT || e.type === c.ACK) && B(e) ? this.encodeAsBinary({
      type: e.type === c.EVENT ? c.BINARY_EVENT : c.BINARY_ACK,
      nsp: e.nsp,
      data: e.data,
      id: e.id
    }) : [this.encodeAsString(e)];
  }
  /**
   * Encode packet as string.
   */
  encodeAsString(e) {
    let t = "" + e.type;
    return (e.type === c.BINARY_EVENT || e.type === c.BINARY_ACK) && (t += e.attachments + "-"), e.nsp && e.nsp !== "/" && (t += e.nsp + ","), e.id != null && (t += e.id), e.data != null && (t += JSON.stringify(e.data, this.replacer)), t;
  }
  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   */
  encodeAsBinary(e) {
    const t = Ze(e), s = this.encodeAsString(t.packet), n = t.buffers;
    return n.unshift(s), n;
  }
}
function Z(i) {
  return Object.prototype.toString.call(i) === "[object Object]";
}
class Y extends u {
  /**
   * Decoder constructor
   *
   * @param {function} reviver - custom reviver to pass down to JSON.stringify
   */
  constructor(e) {
    super(), this.reviver = e;
  }
  /**
   * Decodes an encoded packet string into packet JSON.
   *
   * @param {String} obj - encoded packet
   */
  add(e) {
    let t;
    if (typeof e == "string") {
      if (this.reconstructor)
        throw new Error("got plaintext data when reconstructing a packet");
      t = this.decodeString(e);
      const s = t.type === c.BINARY_EVENT;
      s || t.type === c.BINARY_ACK ? (t.type = s ? c.EVENT : c.ACK, this.reconstructor = new nt(t), t.attachments === 0 && super.emitReserved("decoded", t)) : super.emitReserved("decoded", t);
    } else if (K(e) || e.base64)
      if (this.reconstructor)
        t = this.reconstructor.takeBinaryData(e), t && (this.reconstructor = null, super.emitReserved("decoded", t));
      else
        throw new Error("got binary data when not reconstructing a packet");
    else
      throw new Error("Unknown type: " + e);
  }
  /**
   * Decode a packet String (JSON data)
   *
   * @param {String} str
   * @return {Object} packet
   */
  decodeString(e) {
    let t = 0;
    const s = {
      type: Number(e.charAt(0))
    };
    if (c[s.type] === void 0)
      throw new Error("unknown packet type " + s.type);
    if (s.type === c.BINARY_EVENT || s.type === c.BINARY_ACK) {
      const r = t + 1;
      for (; e.charAt(++t) !== "-" && t != e.length; )
        ;
      const o = e.substring(r, t);
      if (o != Number(o) || e.charAt(t) !== "-")
        throw new Error("Illegal attachments");
      s.attachments = Number(o);
    }
    if (e.charAt(t + 1) === "/") {
      const r = t + 1;
      for (; ++t && !(e.charAt(t) === "," || t === e.length); )
        ;
      s.nsp = e.substring(r, t);
    } else
      s.nsp = "/";
    const n = e.charAt(t + 1);
    if (n !== "" && Number(n) == n) {
      const r = t + 1;
      for (; ++t; ) {
        const o = e.charAt(t);
        if (o == null || Number(o) != o) {
          --t;
          break;
        }
        if (t === e.length)
          break;
      }
      s.id = Number(e.substring(r, t + 1));
    }
    if (e.charAt(++t)) {
      const r = this.tryParse(e.substr(t));
      if (Y.isPayloadValid(s.type, r))
        s.data = r;
      else
        throw new Error("invalid payload");
    }
    return s;
  }
  tryParse(e) {
    try {
      return JSON.parse(e, this.reviver);
    } catch {
      return !1;
    }
  }
  static isPayloadValid(e, t) {
    switch (e) {
      case c.CONNECT:
        return Z(t);
      case c.DISCONNECT:
        return t === void 0;
      case c.CONNECT_ERROR:
        return typeof t == "string" || Z(t);
      case c.EVENT:
      case c.BINARY_EVENT:
        return Array.isArray(t) && (typeof t[0] == "number" || typeof t[0] == "string" && tt.indexOf(t[0]) === -1);
      case c.ACK:
      case c.BINARY_ACK:
        return Array.isArray(t);
    }
  }
  /**
   * Deallocates a parser's resources
   */
  destroy() {
    this.reconstructor && (this.reconstructor.finishedReconstruction(), this.reconstructor = null);
  }
}
class nt {
  constructor(e) {
    this.packet = e, this.buffers = [], this.reconPack = e;
  }
  /**
   * Method to be called when binary data received from connection
   * after a BINARY_EVENT packet.
   *
   * @param {Buffer | ArrayBuffer} binData - the raw binary data received
   * @return {null | Object} returns null if more binary data is expected or
   *   a reconstructed packet object if all buffers have been received.
   */
  takeBinaryData(e) {
    if (this.buffers.push(e), this.buffers.length === this.reconPack.attachments) {
      const t = et(this.reconPack, this.buffers);
      return this.finishedReconstruction(), t;
    }
    return null;
  }
  /**
   * Cleans up binary packet reconstruction variables.
   */
  finishedReconstruction() {
    this.reconPack = null, this.buffers = [];
  }
}
const rt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Decoder: Y,
  Encoder: it,
  get PacketType() {
    return c;
  },
  protocol: st
}, Symbol.toStringTag, { value: "Module" }));
function y(i, e, t) {
  return i.on(e, t), function() {
    i.off(e, t);
  };
}
const ot = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
class fe extends u {
  /**
   * `Socket` constructor.
   */
  constructor(e, t, s) {
    super(), this.connected = !1, this.recovered = !1, this.receiveBuffer = [], this.sendBuffer = [], this._queue = [], this._queueSeq = 0, this.ids = 0, this.acks = {}, this.flags = {}, this.io = e, this.nsp = t, s && s.auth && (this.auth = s.auth), this._opts = Object.assign({}, s), this.io._autoConnect && this.open();
  }
  /**
   * Whether the socket is currently disconnected
   *
   * @example
   * const socket = io();
   *
   * socket.on("connect", () => {
   *   console.log(socket.disconnected); // false
   * });
   *
   * socket.on("disconnect", () => {
   *   console.log(socket.disconnected); // true
   * });
   */
  get disconnected() {
    return !this.connected;
  }
  /**
   * Subscribe to open, close and packet events
   *
   * @private
   */
  subEvents() {
    if (this.subs)
      return;
    const e = this.io;
    this.subs = [
      y(e, "open", this.onopen.bind(this)),
      y(e, "packet", this.onpacket.bind(this)),
      y(e, "error", this.onerror.bind(this)),
      y(e, "close", this.onclose.bind(this))
    ];
  }
  /**
   * Whether the Socket will try to reconnect when its Manager connects or reconnects.
   *
   * @example
   * const socket = io();
   *
   * console.log(socket.active); // true
   *
   * socket.on("disconnect", (reason) => {
   *   if (reason === "io server disconnect") {
   *     // the disconnection was initiated by the server, you need to manually reconnect
   *     console.log(socket.active); // false
   *   }
   *   // else the socket will automatically try to reconnect
   *   console.log(socket.active); // true
   * });
   */
  get active() {
    return !!this.subs;
  }
  /**
   * "Opens" the socket.
   *
   * @example
   * const socket = io({
   *   autoConnect: false
   * });
   *
   * socket.connect();
   */
  connect() {
    return this.connected ? this : (this.subEvents(), this.io._reconnecting || this.io.open(), this.io._readyState === "open" && this.onopen(), this);
  }
  /**
   * Alias for {@link connect()}.
   */
  open() {
    return this.connect();
  }
  /**
   * Sends a `message` event.
   *
   * This method mimics the WebSocket.send() method.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
   *
   * @example
   * socket.send("hello");
   *
   * // this is equivalent to
   * socket.emit("message", "hello");
   *
   * @return self
   */
  send(...e) {
    return e.unshift("message"), this.emit.apply(this, e), this;
  }
  /**
   * Override `emit`.
   * If the event is in `events`, it's emitted normally.
   *
   * @example
   * socket.emit("hello", "world");
   *
   * // all serializable datastructures are supported (no need to call JSON.stringify)
   * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
   *
   * // with an acknowledgement from the server
   * socket.emit("hello", "world", (val) => {
   *   // ...
   * });
   *
   * @return self
   */
  emit(e, ...t) {
    var s, n, r;
    if (ot.hasOwnProperty(e))
      throw new Error('"' + e.toString() + '" is a reserved event name');
    if (t.unshift(e), this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
      return this._addToQueue(t), this;
    const o = {
      type: c.EVENT,
      data: t
    };
    if (o.options = {}, o.options.compress = this.flags.compress !== !1, typeof t[t.length - 1] == "function") {
      const l = this.ids++, d = t.pop();
      this._registerAckCallback(l, d), o.id = l;
    }
    const a = (n = (s = this.io.engine) === null || s === void 0 ? void 0 : s.transport) === null || n === void 0 ? void 0 : n.writable, h = this.connected && !(!((r = this.io.engine) === null || r === void 0) && r._hasPingExpired());
    return this.flags.volatile && !a || (h ? (this.notifyOutgoingListeners(o), this.packet(o)) : this.sendBuffer.push(o)), this.flags = {}, this;
  }
  /**
   * @private
   */
  _registerAckCallback(e, t) {
    var s;
    const n = (s = this.flags.timeout) !== null && s !== void 0 ? s : this._opts.ackTimeout;
    if (n === void 0) {
      this.acks[e] = t;
      return;
    }
    const r = this.io.setTimeoutFn(() => {
      delete this.acks[e];
      for (let a = 0; a < this.sendBuffer.length; a++)
        this.sendBuffer[a].id === e && this.sendBuffer.splice(a, 1);
      t.call(this, new Error("operation has timed out"));
    }, n), o = (...a) => {
      this.io.clearTimeoutFn(r), t.apply(this, a);
    };
    o.withError = !0, this.acks[e] = o;
  }
  /**
   * Emits an event and waits for an acknowledgement
   *
   * @example
   * // without timeout
   * const response = await socket.emitWithAck("hello", "world");
   *
   * // with a specific timeout
   * try {
   *   const response = await socket.timeout(1000).emitWithAck("hello", "world");
   * } catch (err) {
   *   // the server did not acknowledge the event in the given delay
   * }
   *
   * @return a Promise that will be fulfilled when the server acknowledges the event
   */
  emitWithAck(e, ...t) {
    return new Promise((s, n) => {
      const r = (o, a) => o ? n(o) : s(a);
      r.withError = !0, t.push(r), this.emit(e, ...t);
    });
  }
  /**
   * Add the packet to the queue.
   * @param args
   * @private
   */
  _addToQueue(e) {
    let t;
    typeof e[e.length - 1] == "function" && (t = e.pop());
    const s = {
      id: this._queueSeq++,
      tryCount: 0,
      pending: !1,
      args: e,
      flags: Object.assign({ fromQueue: !0 }, this.flags)
    };
    e.push((n, ...r) => s !== this._queue[0] ? void 0 : (n !== null ? s.tryCount > this._opts.retries && (this._queue.shift(), t && t(n)) : (this._queue.shift(), t && t(null, ...r)), s.pending = !1, this._drainQueue())), this._queue.push(s), this._drainQueue();
  }
  /**
   * Send the first packet of the queue, and wait for an acknowledgement from the server.
   * @param force - whether to resend a packet that has not been acknowledged yet
   *
   * @private
   */
  _drainQueue(e = !1) {
    if (!this.connected || this._queue.length === 0)
      return;
    const t = this._queue[0];
    t.pending && !e || (t.pending = !0, t.tryCount++, this.flags = t.flags, this.emit.apply(this, t.args));
  }
  /**
   * Sends a packet.
   *
   * @param packet
   * @private
   */
  packet(e) {
    e.nsp = this.nsp, this.io._packet(e);
  }
  /**
   * Called upon engine `open`.
   *
   * @private
   */
  onopen() {
    typeof this.auth == "function" ? this.auth((e) => {
      this._sendConnectPacket(e);
    }) : this._sendConnectPacket(this.auth);
  }
  /**
   * Sends a CONNECT packet to initiate the Socket.IO session.
   *
   * @param data
   * @private
   */
  _sendConnectPacket(e) {
    this.packet({
      type: c.CONNECT,
      data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, e) : e
    });
  }
  /**
   * Called upon engine or manager `error`.
   *
   * @param err
   * @private
   */
  onerror(e) {
    this.connected || this.emitReserved("connect_error", e);
  }
  /**
   * Called upon engine `close`.
   *
   * @param reason
   * @param description
   * @private
   */
  onclose(e, t) {
    this.connected = !1, delete this.id, this.emitReserved("disconnect", e, t), this._clearAcks();
  }
  /**
   * Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
   * the server.
   *
   * @private
   */
  _clearAcks() {
    Object.keys(this.acks).forEach((e) => {
      if (!this.sendBuffer.some((s) => String(s.id) === e)) {
        const s = this.acks[e];
        delete this.acks[e], s.withError && s.call(this, new Error("socket has been disconnected"));
      }
    });
  }
  /**
   * Called with socket packet.
   *
   * @param packet
   * @private
   */
  onpacket(e) {
    if (e.nsp === this.nsp)
      switch (e.type) {
        case c.CONNECT:
          e.data && e.data.sid ? this.onconnect(e.data.sid, e.data.pid) : this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
          break;
        case c.EVENT:
        case c.BINARY_EVENT:
          this.onevent(e);
          break;
        case c.ACK:
        case c.BINARY_ACK:
          this.onack(e);
          break;
        case c.DISCONNECT:
          this.ondisconnect();
          break;
        case c.CONNECT_ERROR:
          this.destroy();
          const s = new Error(e.data.message);
          s.data = e.data.data, this.emitReserved("connect_error", s);
          break;
      }
  }
  /**
   * Called upon a server event.
   *
   * @param packet
   * @private
   */
  onevent(e) {
    const t = e.data || [];
    e.id != null && t.push(this.ack(e.id)), this.connected ? this.emitEvent(t) : this.receiveBuffer.push(Object.freeze(t));
  }
  emitEvent(e) {
    if (this._anyListeners && this._anyListeners.length) {
      const t = this._anyListeners.slice();
      for (const s of t)
        s.apply(this, e);
    }
    super.emit.apply(this, e), this._pid && e.length && typeof e[e.length - 1] == "string" && (this._lastOffset = e[e.length - 1]);
  }
  /**
   * Produces an ack callback to emit with an event.
   *
   * @private
   */
  ack(e) {
    const t = this;
    let s = !1;
    return function(...n) {
      s || (s = !0, t.packet({
        type: c.ACK,
        id: e,
        data: n
      }));
    };
  }
  /**
   * Called upon a server acknowledgement.
   *
   * @param packet
   * @private
   */
  onack(e) {
    const t = this.acks[e.id];
    typeof t == "function" && (delete this.acks[e.id], t.withError && e.data.unshift(null), t.apply(this, e.data));
  }
  /**
   * Called upon server connect.
   *
   * @private
   */
  onconnect(e, t) {
    this.id = e, this.recovered = t && this._pid === t, this._pid = t, this.connected = !0, this.emitBuffered(), this.emitReserved("connect"), this._drainQueue(!0);
  }
  /**
   * Emit buffered events (received and emitted).
   *
   * @private
   */
  emitBuffered() {
    this.receiveBuffer.forEach((e) => this.emitEvent(e)), this.receiveBuffer = [], this.sendBuffer.forEach((e) => {
      this.notifyOutgoingListeners(e), this.packet(e);
    }), this.sendBuffer = [];
  }
  /**
   * Called upon server disconnect.
   *
   * @private
   */
  ondisconnect() {
    this.destroy(), this.onclose("io server disconnect");
  }
  /**
   * Called upon forced client/server side disconnections,
   * this method ensures the manager stops tracking us and
   * that reconnections don't get triggered for this.
   *
   * @private
   */
  destroy() {
    this.subs && (this.subs.forEach((e) => e()), this.subs = void 0), this.io._destroy(this);
  }
  /**
   * Disconnects the socket manually. In that case, the socket will not try to reconnect.
   *
   * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
   *
   * @example
   * const socket = io();
   *
   * socket.on("disconnect", (reason) => {
   *   // console.log(reason); prints "io client disconnect"
   * });
   *
   * socket.disconnect();
   *
   * @return self
   */
  disconnect() {
    return this.connected && this.packet({ type: c.DISCONNECT }), this.destroy(), this.connected && this.onclose("io client disconnect"), this;
  }
  /**
   * Alias for {@link disconnect()}.
   *
   * @return self
   */
  close() {
    return this.disconnect();
  }
  /**
   * Sets the compress flag.
   *
   * @example
   * socket.compress(false).emit("hello");
   *
   * @param compress - if `true`, compresses the sending data
   * @return self
   */
  compress(e) {
    return this.flags.compress = e, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
   * ready to send messages.
   *
   * @example
   * socket.volatile.emit("hello"); // the server may or may not receive it
   *
   * @returns self
   */
  get volatile() {
    return this.flags.volatile = !0, this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
   * given number of milliseconds have elapsed without an acknowledgement from the server:
   *
   * @example
   * socket.timeout(5000).emit("my-event", (err) => {
   *   if (err) {
   *     // the server did not acknowledge the event in the given delay
   *   }
   * });
   *
   * @returns self
   */
  timeout(e) {
    return this.flags.timeout = e, this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * @example
   * socket.onAny((event, ...args) => {
   *   console.log(`got ${event}`);
   * });
   *
   * @param listener
   */
  onAny(e) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.push(e), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * @example
   * socket.prependAny((event, ...args) => {
   *   console.log(`got event ${event}`);
   * });
   *
   * @param listener
   */
  prependAny(e) {
    return this._anyListeners = this._anyListeners || [], this._anyListeners.unshift(e), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`got event ${event}`);
   * }
   *
   * socket.onAny(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAny(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAny();
   *
   * @param listener
   */
  offAny(e) {
    if (!this._anyListeners)
      return this;
    if (e) {
      const t = this._anyListeners;
      for (let s = 0; s < t.length; s++)
        if (e === t[s])
          return t.splice(s, 1), this;
    } else
      this._anyListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAny() {
    return this._anyListeners || [];
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.onAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  onAnyOutgoing(e) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.push(e), this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.prependAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  prependAnyOutgoing(e) {
    return this._anyOutgoingListeners = this._anyOutgoingListeners || [], this._anyOutgoingListeners.unshift(e), this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`sent event ${event}`);
   * }
   *
   * socket.onAnyOutgoing(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAnyOutgoing(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAnyOutgoing();
   *
   * @param [listener] - the catch-all listener (optional)
   */
  offAnyOutgoing(e) {
    if (!this._anyOutgoingListeners)
      return this;
    if (e) {
      const t = this._anyOutgoingListeners;
      for (let s = 0; s < t.length; s++)
        if (e === t[s])
          return t.splice(s, 1), this;
    } else
      this._anyOutgoingListeners = [];
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAnyOutgoing() {
    return this._anyOutgoingListeners || [];
  }
  /**
   * Notify the listeners for each packet sent
   *
   * @param packet
   *
   * @private
   */
  notifyOutgoingListeners(e) {
    if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
      const t = this._anyOutgoingListeners.slice();
      for (const s of t)
        s.apply(this, e.data);
    }
  }
}
function k(i) {
  i = i || {}, this.ms = i.min || 100, this.max = i.max || 1e4, this.factor = i.factor || 2, this.jitter = i.jitter > 0 && i.jitter <= 1 ? i.jitter : 0, this.attempts = 0;
}
k.prototype.duration = function() {
  var i = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var e = Math.random(), t = Math.floor(e * this.jitter * i);
    i = Math.floor(e * 10) & 1 ? i + t : i - t;
  }
  return Math.min(i, this.max) | 0;
};
k.prototype.reset = function() {
  this.attempts = 0;
};
k.prototype.setMin = function(i) {
  this.ms = i;
};
k.prototype.setMax = function(i) {
  this.max = i;
};
k.prototype.setJitter = function(i) {
  this.jitter = i;
};
class G extends u {
  constructor(e, t) {
    var s;
    super(), this.nsps = {}, this.subs = [], e && typeof e == "object" && (t = e, e = void 0), t = t || {}, t.path = t.path || "/socket.io", this.opts = t, P(this, t), this.reconnection(t.reconnection !== !1), this.reconnectionAttempts(t.reconnectionAttempts || 1 / 0), this.reconnectionDelay(t.reconnectionDelay || 1e3), this.reconnectionDelayMax(t.reconnectionDelayMax || 5e3), this.randomizationFactor((s = t.randomizationFactor) !== null && s !== void 0 ? s : 0.5), this.backoff = new k({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    }), this.timeout(t.timeout == null ? 2e4 : t.timeout), this._readyState = "closed", this.uri = e;
    const n = t.parser || rt;
    this.encoder = new n.Encoder(), this.decoder = new n.Decoder(), this._autoConnect = t.autoConnect !== !1, this._autoConnect && this.open();
  }
  reconnection(e) {
    return arguments.length ? (this._reconnection = !!e, e || (this.skipReconnect = !0), this) : this._reconnection;
  }
  reconnectionAttempts(e) {
    return e === void 0 ? this._reconnectionAttempts : (this._reconnectionAttempts = e, this);
  }
  reconnectionDelay(e) {
    var t;
    return e === void 0 ? this._reconnectionDelay : (this._reconnectionDelay = e, (t = this.backoff) === null || t === void 0 || t.setMin(e), this);
  }
  randomizationFactor(e) {
    var t;
    return e === void 0 ? this._randomizationFactor : (this._randomizationFactor = e, (t = this.backoff) === null || t === void 0 || t.setJitter(e), this);
  }
  reconnectionDelayMax(e) {
    var t;
    return e === void 0 ? this._reconnectionDelayMax : (this._reconnectionDelayMax = e, (t = this.backoff) === null || t === void 0 || t.setMax(e), this);
  }
  timeout(e) {
    return arguments.length ? (this._timeout = e, this) : this._timeout;
  }
  /**
   * Starts trying to reconnect if reconnection is enabled and we have not
   * started reconnecting yet
   *
   * @private
   */
  maybeReconnectOnOpen() {
    !this._reconnecting && this._reconnection && this.backoff.attempts === 0 && this.reconnect();
  }
  /**
   * Sets the current transport `socket`.
   *
   * @param {Function} fn - optional, callback
   * @return self
   * @public
   */
  open(e) {
    if (~this._readyState.indexOf("open"))
      return this;
    this.engine = new Ke(this.uri, this.opts);
    const t = this.engine, s = this;
    this._readyState = "opening", this.skipReconnect = !1;
    const n = y(t, "open", function() {
      s.onopen(), e && e();
    }), r = (a) => {
      this.cleanup(), this._readyState = "closed", this.emitReserved("error", a), e ? e(a) : this.maybeReconnectOnOpen();
    }, o = y(t, "error", r);
    if (this._timeout !== !1) {
      const a = this._timeout, h = this.setTimeoutFn(() => {
        n(), r(new Error("timeout")), t.close();
      }, a);
      this.opts.autoUnref && h.unref(), this.subs.push(() => {
        this.clearTimeoutFn(h);
      });
    }
    return this.subs.push(n), this.subs.push(o), this;
  }
  /**
   * Alias for open()
   *
   * @return self
   * @public
   */
  connect(e) {
    return this.open(e);
  }
  /**
   * Called upon transport open.
   *
   * @private
   */
  onopen() {
    this.cleanup(), this._readyState = "open", this.emitReserved("open");
    const e = this.engine;
    this.subs.push(
      y(e, "ping", this.onping.bind(this)),
      y(e, "data", this.ondata.bind(this)),
      y(e, "error", this.onerror.bind(this)),
      y(e, "close", this.onclose.bind(this)),
      // @ts-ignore
      y(this.decoder, "decoded", this.ondecoded.bind(this))
    );
  }
  /**
   * Called upon a ping.
   *
   * @private
   */
  onping() {
    this.emitReserved("ping");
  }
  /**
   * Called with data.
   *
   * @private
   */
  ondata(e) {
    try {
      this.decoder.add(e);
    } catch (t) {
      this.onclose("parse error", t);
    }
  }
  /**
   * Called when parser fully decodes a packet.
   *
   * @private
   */
  ondecoded(e) {
    L(() => {
      this.emitReserved("packet", e);
    }, this.setTimeoutFn);
  }
  /**
   * Called upon socket error.
   *
   * @private
   */
  onerror(e) {
    this.emitReserved("error", e);
  }
  /**
   * Creates a new socket for the given `nsp`.
   *
   * @return {Socket}
   * @public
   */
  socket(e, t) {
    let s = this.nsps[e];
    return s ? this._autoConnect && !s.active && s.connect() : (s = new fe(this, e, t), this.nsps[e] = s), s;
  }
  /**
   * Called upon a socket close.
   *
   * @param socket
   * @private
   */
  _destroy(e) {
    const t = Object.keys(this.nsps);
    for (const s of t)
      if (this.nsps[s].active)
        return;
    this._close();
  }
  /**
   * Writes a packet.
   *
   * @param packet
   * @private
   */
  _packet(e) {
    const t = this.encoder.encode(e);
    for (let s = 0; s < t.length; s++)
      this.engine.write(t[s], e.options);
  }
  /**
   * Clean up transport subscriptions and packet buffer.
   *
   * @private
   */
  cleanup() {
    this.subs.forEach((e) => e()), this.subs.length = 0, this.decoder.destroy();
  }
  /**
   * Close the current socket.
   *
   * @private
   */
  _close() {
    this.skipReconnect = !0, this._reconnecting = !1, this.onclose("forced close");
  }
  /**
   * Alias for close()
   *
   * @private
   */
  disconnect() {
    return this._close();
  }
  /**
   * Called when:
   *
   * - the low-level engine is closed
   * - the parser encountered a badly formatted packet
   * - all sockets are disconnected
   *
   * @private
   */
  onclose(e, t) {
    var s;
    this.cleanup(), (s = this.engine) === null || s === void 0 || s.close(), this.backoff.reset(), this._readyState = "closed", this.emitReserved("close", e, t), this._reconnection && !this.skipReconnect && this.reconnect();
  }
  /**
   * Attempt a reconnection.
   *
   * @private
   */
  reconnect() {
    if (this._reconnecting || this.skipReconnect)
      return this;
    const e = this;
    if (this.backoff.attempts >= this._reconnectionAttempts)
      this.backoff.reset(), this.emitReserved("reconnect_failed"), this._reconnecting = !1;
    else {
      const t = this.backoff.duration();
      this._reconnecting = !0;
      const s = this.setTimeoutFn(() => {
        e.skipReconnect || (this.emitReserved("reconnect_attempt", e.backoff.attempts), !e.skipReconnect && e.open((n) => {
          n ? (e._reconnecting = !1, e.reconnect(), this.emitReserved("reconnect_error", n)) : e.onreconnect();
        }));
      }, t);
      this.opts.autoUnref && s.unref(), this.subs.push(() => {
        this.clearTimeoutFn(s);
      });
    }
  }
  /**
   * Called upon successful reconnect.
   *
   * @private
   */
  onreconnect() {
    const e = this.backoff.attempts;
    this._reconnecting = !1, this.backoff.reset(), this.emitReserved("reconnect", e);
  }
}
const C = {};
function N(i, e) {
  typeof i == "object" && (e = i, i = void 0), e = e || {};
  const t = Ye(i, e.path || "/socket.io"), s = t.source, n = t.id, r = t.path, o = C[n] && r in C[n].nsps, a = e.forceNew || e["force new connection"] || e.multiplex === !1 || o;
  let h;
  return a ? h = new G(s, e) : (C[n] || (C[n] = new G(s, e)), h = C[n]), t.query && !e.query && (e.query = t.queryKey), h.socket(t.path, e);
}
Object.assign(N, {
  Manager: G,
  Socket: fe,
  io: N,
  connect: N
});
class at extends HTMLElement {
  constructor() {
    super(), this.config = null, this.isRecording = !1, this.shadow = this.attachShadow({ mode: "open" });
  }
  setConfig(e) {
    this.config = e, this.render();
  }
  connectedCallback() {
    this.config && this.render();
  }
  render() {
    if (!this.config) return;
    const { position: e, color: t } = this.config, s = document.createElement("style");
    s.textContent = `
      :host {
        position: fixed;
        z-index: 10000;
        ${this.getPositionStyles(e)}
      }

      .goodfriend-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: ${t};
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .goodfriend-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }

      .goodfriend-button:active {
        transform: scale(0.95);
      }

      .goodfriend-button.recording {
        background: #EF4444;
        animation: pulse 1.5s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% {
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }
        50% {
          box-shadow: 0 4px 20px rgba(239, 68, 68, 0.7);
        }
      }

      .icon {
        width: 28px;
        height: 28px;
        fill: white;
      }

      .ripple {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
      }

      @keyframes ripple-animation {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }

      .tooltip {
        position: absolute;
        bottom: 70px;
        right: 0;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .goodfriend-button:hover .tooltip {
        opacity: 1;
      }
    `;
    const n = document.createElement("button");
    n.className = "goodfriend-button", n.setAttribute("aria-label", "Assistente de voz"), n.innerHTML = `
      ${this.getMicrophoneIcon()}
      <div class="tooltip">${this.isRecording ? "Clique para parar" : "Clique para falar"}</div>
    `, n.addEventListener("click", () => this.handleClick(n)), this.shadow.innerHTML = "", this.shadow.appendChild(s), this.shadow.appendChild(n);
  }
  handleClick(e) {
    if (!this.config) return;
    this.isRecording = !this.isRecording, this.isRecording ? (e.classList.add("recording"), this.config.onRecordStart(), this.updateTooltip("Clique para parar")) : (e.classList.remove("recording"), this.config.onRecordStop(), this.updateTooltip("Clique para falar"));
    const t = document.createElement("div");
    t.className = "ripple", e.appendChild(t), setTimeout(() => t.remove(), 600);
  }
  updateTooltip(e) {
    const t = this.shadow.querySelector(".tooltip");
    t && (t.textContent = e);
  }
  getPositionStyles(e) {
    switch (e) {
      case "bottom-right":
        return "bottom: 20px; right: 20px;";
      case "bottom-left":
        return "bottom: 20px; left: 20px;";
      case "top-right":
        return "top: 20px; right: 20px;";
      case "top-left":
        return "top: 20px; left: 20px;";
      default:
        return "bottom: 20px; right: 20px;";
    }
  }
  getMicrophoneIcon() {
    return `
      <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
      </svg>
    `;
  }
}
const _ = class _ {
  constructor(e) {
    this.socket = null, this.mediaRecorder = null, this.audioContext = null, this.isRecording = !1, this.iconComponent = null, this.config = {
      ...e,
      uiOptions: {
        position: "bottom-right",
        color: "#4F46E5",
        renderDefaultUI: !0,
        ...e.uiOptions
      }
    };
  }
  /**
   * Inicializa o GoodFriend
   */
  static init(e) {
    return _.instance || (_.instance = new _(e), _.instance.setup()), _.instance;
  }
  /**
   * Obtém a instância do GoodFriend
   */
  static getInstance() {
    return _.instance;
  }
  /**
   * Configuração inicial
   */
  async setup() {
    var e;
    this.connectToServer(), this.config.contextUrl && await this.loadContextFromUrl(this.config.contextUrl), this.config.collectPageContext && this.collectAndSendPageContext(), ((e = this.config.uiOptions) == null ? void 0 : e.renderDefaultUI) !== !1 && this.renderDefaultUI();
  }
  /**
   * Carrega contexto de uma URL
   */
  async loadContextFromUrl(e) {
    var t, s;
    try {
      console.log("[GoodFriend] Carregando contexto de:", e);
      const n = await fetch(e);
      if (!n.ok)
        throw new Error(`HTTP ${n.status}: ${n.statusText}`);
      const r = await n.text(), o = this.config.context ? `${this.config.context}

${r}` : r;
      this.updateContext(o), console.log("[GoodFriend] Contexto carregado:", r.length, "caracteres");
    } catch (n) {
      console.error("[GoodFriend] Erro ao carregar contexto:", n), (s = (t = this.config).onError) == null || s.call(t, `Erro ao carregar contexto: ${n instanceof Error ? n.message : "Erro desconhecido"}`);
    }
  }
  /**
   * Coleta contexto da página atual
   */
  collectPageContext() {
    const e = [];
    return document.querySelectorAll("[data-goodfriend-help]").forEach((s) => {
      var a;
      const n = s.getAttribute("data-goodfriend-help") || "", r = s.tagName.toLowerCase(), o = ((a = s.textContent) == null ? void 0 : a.trim().substring(0, 50)) || "";
      e.push({
        element: r,
        text: o,
        help: n
      });
    }), {
      currentPage: window.location.pathname,
      pageTitle: document.title,
      helpAttributes: e
    };
  }
  /**
   * Coleta e envia contexto da página ao servidor
   */
  collectAndSendPageContext() {
    const e = this.collectPageContext();
    let t = `

## Contexto da Página Atual
`;
    t += `**URL**: ${e.currentPage}
`, t += `**Título**: ${e.pageTitle}

`, e.helpAttributes.length > 0 && (t += `### Elementos com Ajuda:
`, e.helpAttributes.forEach((n) => {
      t += `- **${n.element}** "${n.text}": ${n.help}
`;
    }));
    const s = this.config.context ? `${this.config.context}${t}` : t;
    this.updateContext(s), console.log("[GoodFriend] Contexto da página coletado:", e.helpAttributes.length, "elementos");
  }
  /**
   * Conecta ao servidor WebSocket
   */
  connectToServer() {
    console.log("[GoodFriend] Conectando ao servidor:", this.config.serverUrl), this.socket = N(this.config.serverUrl, {
      transports: ["websocket"],
      reconnection: !0,
      reconnectionDelay: 1e3,
      reconnectionAttempts: 5
    }), this.socket.on("connect", () => {
      var e;
      console.log("[GoodFriend] Conectado ao servidor"), this.config.context && ((e = this.socket) == null || e.emit("set_context", this.config.context));
    }), this.socket.on("context_set", (e) => {
      console.log("[GoodFriend] Contexto configurado no servidor:", e);
    }), this.socket.on("transcription", (e) => {
      var t, s;
      console.log("[GoodFriend] Transcrição recebida:", e.text), (s = (t = this.config).onTranscription) == null || s.call(t, e.text);
    }), this.socket.on("llm_stream_start", () => {
      var e, t;
      console.log("[GoodFriend] Iniciando streaming do LLM..."), (t = (e = this.config).onStreamStart) == null || t.call(e);
    }), this.socket.on("llm_response_chunk", (e) => {
      var t, s;
      (s = (t = this.config).onResponseChunk) == null || s.call(t, e.text);
    }), this.socket.on("llm_stream_end", () => {
      var e, t;
      console.log("[GoodFriend] Streaming do LLM finalizado"), (t = (e = this.config).onStreamEnd) == null || t.call(e);
    }), this.socket.on("llm_response", (e) => {
      var t, s;
      console.log("[GoodFriend] Resposta do LLM:", e.text), (s = (t = this.config).onResponse) == null || s.call(t, e.text);
    }), this.socket.on("audio_response", (e) => {
      console.log("[GoodFriend] Áudio recebido:", e.byteLength, "bytes"), this.playAudio(e);
    }), this.socket.on("error", (e) => {
      var t, s;
      console.error("[GoodFriend] Erro do servidor:", e), (s = (t = this.config).onError) == null || s.call(t, e.message);
    }), this.socket.on("disconnect", (e) => {
      var t;
      console.log("[GoodFriend] Desconectado do servidor:", e), e === "io server disconnect" && ((t = this.socket) == null || t.connect());
    }), this.socket.on("connect_error", (e) => {
      var t, s;
      console.error("[GoodFriend] Erro de conexão:", e.message), (s = (t = this.config).onError) == null || s.call(t, `Erro de conexão: ${e.message}`);
    }), this.socket.on("reconnect", (e) => {
      console.log("[GoodFriend] Reconectado após", e, "tentativas");
    }), this.socket.on("reconnect_error", (e) => {
      console.error("[GoodFriend] Erro ao reconectar:", e.message);
    }), this.socket.on("reconnect_failed", () => {
      var e, t;
      console.error("[GoodFriend] Falha ao reconectar após todas as tentativas"), (t = (e = this.config).onError) == null || t.call(e, "Não foi possível conectar ao servidor. Verifique sua conexão.");
    });
  }
  /**
   * Renderiza a UI padrão (ícone flutuante)
   */
  renderDefaultUI() {
    var e, t;
    customElements.get("goodfriend-icon") || customElements.define("goodfriend-icon", at), this.iconComponent = document.createElement("goodfriend-icon"), this.iconComponent.setConfig({
      position: ((e = this.config.uiOptions) == null ? void 0 : e.position) || "bottom-right",
      color: ((t = this.config.uiOptions) == null ? void 0 : t.color) || "#4F46E5",
      onRecordStart: () => this.startListening(),
      onRecordStop: () => this.stopListening()
    }), document.body.appendChild(this.iconComponent);
  }
  /**
   * Verifica se o navegador suporta o mimeType especificado
   */
  getSupportedMimeType() {
    const e = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/mp4"
    ];
    for (const t of e)
      if (MediaRecorder.isTypeSupported(t))
        return t;
    return "";
  }
  /**
   * Inicia a captura de áudio
   */
  async startListening() {
    var e, t, s, n, r, o;
    if (this.isRecording) {
      console.warn("[GoodFriend] Já está gravando");
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const a = "Seu navegador não suporta captura de áudio";
      console.error("[GoodFriend]", a), (t = (e = this.config).onError) == null || t.call(e, a);
      return;
    }
    if (typeof MediaRecorder > "u") {
      const a = "MediaRecorder não está disponível neste navegador";
      console.error("[GoodFriend]", a), (n = (s = this.config).onError) == null || n.call(s, a);
      return;
    }
    try {
      console.log("[GoodFriend] Iniciando captura de áudio...");
      const a = await navigator.mediaDevices.getUserMedia({ audio: !0 }), h = this.getSupportedMimeType(), g = h ? { mimeType: h } : {};
      this.mediaRecorder = new MediaRecorder(a, g), console.log("[GoodFriend] Usando mimeType:", this.mediaRecorder.mimeType);
      const l = [];
      this.mediaRecorder.ondataavailable = (d) => {
        d.data.size > 0 && (l.push(d.data), d.data.arrayBuffer().then((f) => {
          var m;
          (m = this.socket) == null || m.emit("audio_chunk", f);
        }));
      }, this.mediaRecorder.onstop = () => {
        var f;
        console.log("[GoodFriend] Gravação finalizada"), new Blob(l, { type: ((f = this.mediaRecorder) == null ? void 0 : f.mimeType) || "audio/webm" }).arrayBuffer().then((m) => {
          var E, x;
          (E = this.socket) == null || E.emit("audio_stream", m), (x = this.socket) == null || x.emit("audio_end");
        }).catch((m) => {
          var E, x;
          console.error("[GoodFriend] Erro ao converter áudio:", m), (x = (E = this.config).onError) == null || x.call(E, "Erro ao processar áudio gravado");
        }), a.getTracks().forEach((m) => m.stop());
      }, this.mediaRecorder.onerror = (d) => {
        var f, m;
        console.error("[GoodFriend] Erro no MediaRecorder:", d), (m = (f = this.config).onError) == null || m.call(f, "Erro durante a gravação de áudio"), this.isRecording = !1, a.getTracks().forEach((E) => E.stop());
      }, this.mediaRecorder.start(100), this.isRecording = !0, console.log("[GoodFriend] Gravação iniciada");
    } catch (a) {
      console.error("[GoodFriend] Erro ao iniciar gravação:", a), (o = (r = this.config).onError) == null || o.call(r, "Erro ao acessar o microfone. Verifique as permissões.");
    }
  }
  /**
   * Para a captura de áudio
   */
  stopListening() {
    if (!this.isRecording || !this.mediaRecorder) {
      console.warn("[GoodFriend] Não está gravando");
      return;
    }
    console.log("[GoodFriend] Parando gravação..."), this.mediaRecorder.stop(), this.isRecording = !1;
  }
  /**
   * Reproduz o áudio recebido do servidor
   */
  async playAudio(e) {
    var t, s;
    try {
      if (!this.audioContext) {
        const a = window.AudioContext || window.webkitAudioContext;
        if (!a)
          throw new Error("AudioContext não suportado neste navegador");
        this.audioContext = new a();
      }
      this.audioContext.state === "suspended" && await this.audioContext.resume();
      const n = e.slice(0), r = await this.audioContext.decodeAudioData(n), o = this.audioContext.createBufferSource();
      o.buffer = r, o.connect(this.audioContext.destination), o.start(0), console.log("[GoodFriend] Reproduzindo áudio...");
    } catch (n) {
      console.error("[GoodFriend] Erro ao reproduzir áudio:", n), (s = (t = this.config).onError) == null || s.call(t, "Erro ao reproduzir áudio");
    }
  }
  /**
   * Atualiza o contexto da plataforma
   */
  updateContext(e) {
    var t;
    this.config.context = e, (t = this.socket) == null || t.emit("set_context", e);
  }
  /**
   * Desconecta e limpa recursos
   */
  destroy() {
    var e, t;
    this.isRecording && this.stopListening(), (e = this.socket) == null || e.disconnect(), (t = this.audioContext) == null || t.close(), this.iconComponent && this.iconComponent.remove(), _.instance = null, console.log("[GoodFriend] Instância destruída");
  }
};
_.instance = null;
let ee = _;
export {
  ee as GoodFriend,
  at as GoodFriendIcon,
  ee as default
};
//# sourceMappingURL=index.esm.js.map
