class Saltire extends HTMLElement {
  flag = (() => {
    const el = document.createElement("input");
    el.type = "file";
    el.accept = "image/*";
    el.id = "flag";
    el.style.display = "none";
    return el;
  })();
  flagLabel = (() => {
    const el = document.createElement("label");
    el.htmlFor = "flag";
    el.innerText = "Upload";
    return el;
  })();

  canvas = document.createElement("canvas");
  ctx = this.canvas.getContext("2d");
  static saltire = new Promise((res) => {
    const img = new Image();
    img.src = "../assets/saltire.png";
    img.addEventListener("load", () => {
      res(img);
    });
  })
    .then((x) => {
      if (!(x instanceof Image)) throw new Error("saltire failed");
      else return x;
    })
    .catch(() => {
      return new Image();
    });

  connectedCallback() {
    this.appendChild(this.flag);
    this.appendChild(this.flagLabel);
    this.appendChild(this.canvas);
    this.canvas.style.display = "none";

    this.flag.addEventListener("input", async () => {
      if (this.flag.files?.length !== 1) return;
      const uploaded = this.flag.files[0];

      const img = new Image();
      img.src = URL.createObjectURL(uploaded);
      await new Promise((res) => {
        img.addEventListener("load", res);
      });

      this.canvas.width = img.width;
      this.canvas.height = img.height;
      this.ctx?.drawImage(img, 0, 0);
      this.ctx?.drawImage(await Saltire.saltire, 0, 0, img.width, img.height);
      this.canvas.style.display = "block";
    });

    this.canvas.addEventListener("click", async () => {
      const url = this.canvas.toDataURL();
      const a = document.createElement("a");
      a.href = url;
      a.click();
    });
  }
}

customElements.define("saltire-the-gays", Saltire);
