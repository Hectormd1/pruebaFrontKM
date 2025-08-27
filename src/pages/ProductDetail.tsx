import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { slugify } from "../utils/slugify";

// Mock de productos (debería ser el mismo que en ProductList)
const mockProducts = [
  {
    id: 1,
    name: "iPhone 14",
    brand: "Apple",
    price: 999,
    image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTQs_jfMaWtdFJVKdDgujX8FKFLti51nazGxUsNNyLrWFgOEPIoI15M8DlmsaljZuHc8RkfyvgNc4e7CL7hT2XCZl5YM3rKvHH78SVca8IGYhUI-q14c2gL1ZfPNyj5Zj0hFU2gmF8tvUM&usqp=CAc", // iPhone
    colors: ["Negro", "Blanco", "Azul"],
    storages: ["128GB", "256GB", "512GB"],
    description:
      "El iPhone 14 es el último smartphone de Apple con pantalla OLED y cámara avanzada.",
    specifications: {
      cpu: "",
      ram: "",
      sistemaOperativo: "",
      resolucionPantalla: "",
      bateria: "",
      camaras: "",
      dimensiones: "",
      peso: "",
    },
  },
  {
    id: 2,
    name: "Galaxy S23",
    brand: "Samsung",
    price: 899,
    image:
      "data:image/webp;base64,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", // Samsung
    colors: ["Negro", "Verde", "Lavanda"],
    storages: ["128GB", "256GB"],
    description:
      "El Galaxy S23 ofrece potencia y diseño premium con cámara de alta resolución.",
    specifications: {
      cpu: "",
      ram: "",
      sistemaOperativo: "",
      resolucionPantalla: "",
      bateria: "",
      camaras: "",
      dimensiones: "",
      peso: "",
    },
  },
  {
    id: 3,
    name: "Pixel 8",
    brand: "Google",
    price: 799,
    image:
      "data:image/webp;base64,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", // Pixel
    colors: ["Negro", "Gris"],
    storages: ["128GB", "256GB"],
    description:
      "El Pixel 8 destaca por su software puro y actualizaciones directas de Google.",
    specifications: {
      cpu: "",
      ram: "",
      sistemaOperativo: "",
      resolucionPantalla: "",
      bateria: "",
      camaras: "",
      dimensiones: "",
      peso: "",
    },
  },
  {
    id: 4,
    name: "Xperia 5",
    brand: "Sony",
    price: 699,
    image:
      "data:image/jpeg;base64,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", // Sony Xperia
    colors: ["Negro", "Rojo"],
    storages: ["128GB"],
    description:
      "Sony Xperia 5 es compacto, potente y con pantalla OLED de alta calidad.",
    specifications: {
      cpu: "",
      ram: "",
      sistemaOperativo: "",
      resolucionPantalla: "",
      bateria: "",
      camaras: "",
      dimensiones: "",
      peso: "",
    },
  },
  {
    id: 5,
    name: "OnePlus 11",
    brand: "OnePlus",
    price: 749,
    image:
      "data:image/webp;base64,UklGRkYLAABXRUJQVlA4IDoLAAAQNwCdASqFAIUAPkkejEQioaEUib8EKASEs4BrCGAvqv3AS7NwAHSdftx6TN0f8SfLr7N9tubr1h4pfv9+x/K7lr2xP8J+TPH52U9Aj2/+W/5v+o+QlqfeBfNV9H/CO+4f6H/ae4R/Pf7r/rv69+VXybf7v+N9D30v/4PcL/lf9S/3H99/eb/LfM57Av3A9in9bkMf1vauVtK/IRosdXJ+PS+S3PhQMxEqr3M7q86n5DsOtwh9cVbWHsLzmJnp3rdpjD1bSwMDv040ry8N7wbxtFH98FHQeFOqR1Lo0Wk9+e0h+O2rMbPuER9/Zv4+p2r428XptV7nbH2LUaMAuabTnEmxjV9W4MzjtgXcWeAXtAsW9Np8gm0/Faxm34LtyJ+TKflGxg4ngCa7Bv2yO5jdTBcSB62rfte542Ij7sid2ANl7GqesIbbopRbRTOlqODatIjsgPCK0SQ07Ipl7mMYBNb8w5IkZS1AFef9x50mjEOhkWowj9lu7JWTnCdlXqzitGdB/WNP7x+PhhMPtIhcDJ7WEdiQEcgwo1cLAAVTwUvTjq+rJ8FXVUda4ghu5U67rdmaXi/gMNfZMudtVhYJAAD+/6JqyVhX04PL7doVi4xN9h/c9gu/dcaGx7q8UhF3aXhITWyT+OwT1qWsX0CPbHZOxHSI4OBYp8tewyuiWeXbwrCQU7hlwljjtkMgV9FJ76b0vCg26aTyQTr4iSN9Bujof+Gs1ImSLM18rggeyyzryNtgsqAbX/XLjHUCqGym8TXEd+YKgQ75Lg525Z3Us1q3tWHvNVJzpPoZ0oR5Aq9p/vMOR2iiUHfyY+meU345pubobrbYv1/YM0k/SrI3qpy/xUwEQYFedeUGnmYxHfjInvyUaCMJGN5Wvc0C+03PrUnA+e4b/gD+yeLzpFHHHaj+bE2W9SnYPPWSluahQumArKwE6G5dXXnxiYI8ocbLJB+0q+B+94Mi45vDWYkr7yqpnI/0H6scOxF9VtTaPsWZi3gXx3iDZQXcVFBhK4Nnc9spMtqUQbtgUAXGcdvdY1UeGo3qFmv8ncvz3sypFqWx6DtUg2WaENF7RSIOuNL/m7xKpy+mpu/hAM/fsE8/yw0URpdmcdbW31S78/GNAR3p94jSjat/nHqd9KG+7xrg9kw9IE44YQhRdfgtyyuI0LfSMdCpq872wQCRSOHtGDv/BLrwbBg6R1Cf5JF2Qflmil1/G4GYOTauRDDPUHkuB7fR6nISYC/b29XjNUwnAao8VBk1smEcikVubaYQpT5Qdb9uY/fBHLHZBaQv1enAiKNN+qEYJOc7wyD1FasuGtiATl9RaipyIXgmc4F+Ce6j3lpt7Wz8MfLdtGXhdsx02rZwmM785/UdT8GKQxH7tdFxa68KhKYgiz3L0wHKwNxNLAMzerD0rHnFsjImJ3224m6cNdzrRNY8xwMqcOWYNVU+Hd1mp7Itw/VUEtAxECDxSya2ZEuFy1MXQ3eJdJneFJBm2X/8LUXv9Q//lQgMC/vr5/0uDccX4Stx/s7poR3/jsLCpUWJ/8YPePFt38h1AmJGqt7B/x8y5+2fMSZuUw2co+GzWEEfxe8n/E67MGHmiYRZg+69rMLZDPARL67L/yodjez0zGrIwbfd8V06g8VLd4iqVmZ8vtO46MlVNzLWpqJVk3u2GM4RS85U3YAyCraAYzk0lyCRq4O8gsuyFomfMsLqMyPhGffPjR4AmN7mGXpj0kmCtjTzlQpGLzS2tOl4P2N6lfa/05od46arOd1rQ/tIwhQX3zwFVRi3t/F7Jqyk6KsFfR7ojok23RDcxClCeJuvYMDMcui2u6ff8cQvTV49k3rz/0KXrtywMGlY29D0f3k41MrrU/PEbbYLj+4MyWoz09ahfINYVB5AwEnnrZrVYFA33iMRmtIlooQ7pdfG/rU9Lx3r4eAHcPLbbg6BA0zjVEdJtHPyD2hQwI5OtG97VI+kkdH+JDteQgBMQY1rSmgqswXjInz6y6EeDQy3Sx0pXZ2b72UXIIIJmvkZH8CyA86i9pOogmlAQ/KLXVK7cI3JlUkcdAiRmL2AeT+5w+lrM/hLatsRbWkQeOHPwEnpyZpz/RWR6sEPKBGMJF6mVckPSlHchiqr2qNF75JdA5rhTSj/vCIH96R6//V4LABdkpZJ9fTnNJHZrNapQg5Y2NKoe6i15Xxn97/jM8415efiwkTCFaG1mQ2rAlMfCjl2PGa2B9MX3YbCtGuDSuisoWUSQUUcegB5ROs+NU737WmJN4h5l+MMRGA2HxfsAQysp/LwgoGOTOqP3zwX+KsekMwzR/5nBXPNxLW129HAYhGP/TgaFR/ZxOpWGZcmqQHAS+9foQwSlE9KrdAGDl/sVPZSLL0fPBtMNJNo8czPgwKd6DWH+1kj66LavUTPDMEd1oi0tDBSlE90Fl3DlMiv9T51CrZHjptGcXSlTTNMDOtWXP/iO3RvKoN/N2VUryjYOluGiRw32RzHf8dpTR+SO6pVKQ6JKBRY9nP+8tnI2lKHWj6mpf/jCz4ph8Dnq2sCVNGajuW+VSHCicbdgath5bJBW/RuLVyylGE5F1NkYZzNUIf/RH6EnDT5nhaxXVyzkyUxhtLRv5X+/SReGsobpC3pS45joKwn86LLB/R0H1ahv3MjkXb+rTivkcAT8Ru+lKkTzPaFF1bfm+YQinPwhM60m0WSCaimEV9WtqQnAse63RgEaFmFPSf5VJZxNZgMxMIWgFfJMH08+L9ndbNesQfADoGh2zUvfkbnw3ucwowiYdmnolGaOsdAKXQ50pVZMrczU/+oNE/ZQtwqnaFBU+GQ127tR2j/WA9r7qwf4MvGOiNqcKr2rwFCqNLNQHU2QMx/agZimEeQb0zi9jdm2s2ecF1uf1A+jYaZzzw4peWXe/faMYfUm/EzaPsCvu3q+Hl3A4RF3CqMKhiJfrSi2jATDh0C14PTEAOKiDRyMuaRuSWayMcEOVt8FHuCqBjagNMalTaU2y2HUggU8stdcvUDMf/GIa16aPKnnAGnXFHXbfFF524pIYNjFDq79+SdpVdyEOy69M4cYKxRnL6dsobtz12/snH54UT8qOOGNoAOdzzA3ZtI8pMULz4PvMFjwSOhCprLkFUvoEqFVkeF+2T9hGLJHNLucQPhLbzGmRyBeCZLLn+0/uGH6hdJ7VPHygu3qjJNVU+T3Fz+uJdDLo9hJw7cQfG+iA2nJJOEoNqrqnGPLITn8XcECV4ekuvOa0wIyRfbEeZBXGdncsHqK78DUMfrMUTV1ZjqiMaiCy8ov7FwDmOJMlx/6lbdT0KwVwKnuP4D3GlY8okw91/4qEN9Ubtx9C1BrkkUIvvnMvCuuN1Gtd/iaZf0l5ELzx/VmpF7YB2C9QxPxwCu+P2ljn44eA+DAz75M8u2PR0kkmoGhueaSXihbh+iKFe+HeaskzijoclB68/+TsM/90i37/TxhpbE7efYfJ0hCbbmTdaLPvXndcLJnzNJXflbmJvT51Wdws21datgJ1hKiVMhkeGV7FDth9QhbjyjhHYEE+Lef6Lr+Baa4xoFWDiIOftuawA5eOUfkUV0Ob32RT3EiswfkFj2jKn3KpgPtdWUEaNPtzLuF0Hyo3LYpLv1ezJSSOS1c+8LvSgGQOA2sHfH6GuQiIza+FPrZeV88MRzSImRA3UoGqBOHAFHhpTCKYgnWWBEwMuLOJxDZWpHCDvURd7YA+v/hev/4ydTieH9FpbP+EaP4Xbh8z0gkOSH8QVunrf7xk7Ewh3mj5imYvmouaxrwy1xV2fPqctfi2awADvfbepT/a9yCeCLnonlE+o3wcKAAAA=", // OnePlus
    colors: ["Negro", "Verde"],
    storages: ["256GB"],
    description: "OnePlus 11 combina velocidad, fluidez y carga ultrarrápida.",
    specifications: {
      cpu: "",
      ram: "",
      sistemaOperativo: "",
      resolucionPantalla: "",
      bateria: "",
      camaras: "",
      dimensiones: "",
      peso: "",
    },
  },
  {
    id: 6,
    name: "Moto Edge",
    brand: "Motorola",
    price: 599,
    image:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhISEhIWFhUVFhIVFRgVFhUVFRUVFRcWFxcVFhUYHSggGBomGxgXITElJSkrLi4uFyAzODMsNygtLisBCgoKDg0OGxAQGy0lHyUtLS0uNTItLS0tLS0wLS8tLS0tLS0tLS0tLS0uLy0tLS0tLS0tLS0vLS0tLS0tLS0tLf/AABEIAOEA4QMBEQACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAABQEDBAYHAgj/xABEEAABAwICBgcDCQcCBwAAAAABAAIDBBESIQUGEzFBgQciUWFxkaEycrEUI0JSgpKissEzQ1NiwtHwc5MVJZSjs9Px/8QAGwEBAAIDAQEAAAAAAAAAAAAAAAIEAQMFBgf/xAAzEQEAAgIABAIJAwQDAQEAAAAAAQIDEQQSITFBUQUTYXGBkbHB8CKh0SMy4fEUQlKSFf/aAAwDAQACEQMRAD8A7igICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg8SytaLucGjvIHxRmImeyrHgi4II7RmEYekBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQfP8ArdpKWaokMxzbcBv0W57gO4ZX7vFa5l6vg8VcOKOXxhDR1TohiZI6PvY5zDywkElE818da82TWvbG0lo3pArGmzKt5tlaSz+R2jSfW6z1hz6/8HNOoiN/GP8ADZKTpSrG/tI4pB7rmO8w4j8KcyV/RWGf7ZmPlP8ACboulmI/taZ7f9N7X87OwrPMrW9E2/62j49P5TtH0iUD8jK5h7JI3jzcAW+qzuFa/o7iK/8AXfumP9pyi03TTfsqiJ/c2RpPkDdZ2q3w5Kf3VmPgz0axAQEBAQEBAQEBAQEBAQEBAQEBAQEHBdfabBWzi1rucR4O3LXPd6rg7c2Cs+xqFeThu12F/Vw33HM353w+azXuo+k6zNIlEltto55s51j1Rk+2bmnKzLW337N62a6OEnNDVLJXBpc5rMTAXOHWa0kBxtxtmVrmOr0HAcTe+G0d7V7e3ySmn6OOKQthmbK3CHBzbG179UkZE2HqFiVvBlvkx8166mGE03WFmJ3A4X3i6M7mG79GWscsdVHTPe50M2Joa4khjwC5pbf2QbFthlmFKsuV6S4as45yRGpj93ZVNwBAQEBAQEBAQEBAQEBAQEBAQEBAQcf6W6bDVNf9drT5dX+6127vR+i7bwa8p/Pq5/LTh7cJ4E2WFy2OL15ZR1RRsJLSAMQF7lrjcbi25Dhzv4qUWcXN6PiL6idfGP8AEsnRtCYwbnMgAdwF7c81iZ26XBcL6is77ym9KTQOwbGNzOrZ4JuL5Wt28c8lhnhaZ680ZZ3HgjYNw7rjyRZp2XESXaOq2UsU38KSOTkxwcfQLLXlpz0mvnEvpVpuLjcVseQVQEBAQEBAQEBAQEBAQEBAQEBAQEHNemOEYYHcTjHJuf8AV6KFnb9EW6Wr+fnRyt5Nn232uPJRdad9dISoaHS4btDQ/E14Fy72QQRcXyOK2+wsMyttXk+I36y2/NnaNmtZmK563DIEHc08W7/BRtDp+jOJtNvVW7eH8M4OzIt/n+XUHZ3PNp5i3uHffzRiveYXLolMrM7yHFmzech1gG4cxfK5BPIJMxHeVSvFzfc46TMR49P23LrervSfRtghjqDNHIyONjy6CQsLmtALg5gORtfNTi0ebg58F4vM8sxHubJR696NlsGV0FzwdII3fdfYqSvqU7T1LHi7HtcO1rg4eYRhdQEBAQEBAQEBAQEBAQEBAQEBBpXSvS4qRj8upIL+DmuGXPCOajZ0/Rd9Zdfn51cXdcWNu4qDvW3HVgT0rDm217hwubFpHKxHd5ELMTpz+J4PHlncdJXKSjDXYr5Dc0WsCcifL4pMs8HwUYbc8zuWU5hxA+H6/oUXprPNt5J6/wBn4FYP+7Glqw17bm1nMJPYA4G/osq+TJ15Wz6UitFSusAdi1jrbscXUdbmCtOaP1Nfouf6PL5Sii+yhC1krtmRTNkY6OQAhwIzAPPNWMdtS5HEYmuVFOIyCyOzsViYyY3DOxILbcc/CyzeOW3fp3hGsVvjiYpud6nXT4/dJUen62L9nXVLbZWMrpG9xwyYhn+hUpn9MWj8n/P8mPhcdpmlu8dffH+O3y807R9JGlGb6iOX/VgbfzjLViLs29GR/wBbfs2vVjpWkkmjirII2tkcGbWFzrNc42bijeCQ25AJDjbste2YtCtm4DJjjm7w6opKQgICAgICAgICAgICAgIIHXmlMlFO0C5Aa4D3XAnf3XWLdlrgrcuaHBu0d61vVrTmDsRCaw8GnaiPq6qGn7HEc1lj1flKkUGG5vc96FcfL1RGkR1isqObpfbd2P2lBG7ix48pWNefxFy1ZY6RLHATy58lPih5Fph07QxTLhK2VlQzU2tzS3ce8YuYsD6WP2FYvHNi35fRRxTyZdeFunx7x9/2WXusQTu3Hw7eRz81DBaP7Z7T+RP54N2eJrMZK94/ePGPzx09hYmJidSu1tFoiY7S9Ik+l9Xa/wCUUtPNxkjY4+8QMQ87rc8vlpyXmvlKRRAQEBAQEBAQEBAQEBAQY+kI8UUjfrMePMEJLZity3rPth86TDru781qewp1hZQEFEYUIQQ2k25qUOfxEdW1aovx0s8e84CR4xPv8JR5KF43WVfHbl4qlvONfJgvVeHaswalqnVVyQjnzYXNJ3Ai/unJ3oSruDrPLPj0cniYmI3HeOvy6r8gtcHhcHkqcbidSu21aNx2lWF92jtHVPL2TzH5SrOT9URf4T74/mPpLVwluWZxT4dY90/xP1heBWpedu6HK/HQmLjDK9v2X2kB83OHJbK9nC9IU5c2/OP8fZvakoiAgICAgICAgICAgICAg+e9ZKMxVUrDwe8C3ZiNlqev4e3Njrbz/wBoso2vKAgIwjdKMyuswqcTHRLdHs3zxYdzrtPhIxzfzCNZ84c3NOopfyt9Xqojs5zewkeRVV3t7jazFRvlkZFGLvkc1jR2ucbC54DvUqtGWYrWbT2h1ug1A0bRQtfVxtneXRMe+UYmY5XtjaGxnqtbicM99t5Vqsaeby8RfLPTpDN0/wBH+jZGEuiEBuAJITgsXENF2+ycyN4UbViesmLictdVidx5ORa26mz6OlAf14ZerHK0WBfva14+g/IjsIJsd4GzFWZ3Tz7e+O38fFYrxFZtGSOmu/unv/PwQTXKu7Lo3QppDDVTwE5SxBw96J3xs8/dWyrnekqbpW3lOvn/AKdmU3GEBAQEBAQEBAQEBAQEBBxbpQp8FaXcHBp9AT6la57vT+jrbwR7Gov3rC9LwjCqDYq/RkUMhaQZGCNji4XBJLiCAR9Lcbd6laupQrbmr21LW9P0gYSGnE0i7SeIKwhnr+lG6uVOznDuzrc4yJB+S3NZ8XIzRvFaPj8m06xwYaiQDcTiHgc1XtGpdfhr8+Gs+xndHjW/8SpcXbLb3tlJZSx/3NHHxP8Ax7a9n1hv/TKf+VTt+s6AeUjXforLgcNXd/hP0QlTrMavVyWZzrytZHDKeO0EsbMf2gQ77SZo5YT4an9eI/O22xap18WltGhs4DiRsZxxEjLWeOwnqvBG4kdijjv2nxa+JxeqyTXw+ziWsminUtVNTv3sdkbWDmuAc1w8QUyxHPMx2nr+e7s7PCZOfFWZ79vl+bZWpOkdhX0sl7DatY73ZLxn81+ShWeqXFU58No9m/l1fSa2vOiAgICAgICAgICAgICAg5b0xU3Xhk/ltzuSfSyhbu73om39O1fa505RdeXlGFEE9onTMbWPZM1xJFmuFj3AkHcbDeFKNdWJmeiJ01XGYMBGTAQDxNzckrG0LxGpazSvwTMJyAe2/u361+611mXM5d21Pi3vTLcTKeQ7zEGu96PqO9QVpyx+pv8ARdt4eWfCWJoyd0UscrPaje1478JvY9x3c1Gs6X74oyVms+Lsulmw1sVECA+GWZry07nBkUr8Lh7zQCD2EK1venmK0vhtkie8R9ZiPuw9O6lRPBjgY2OKd0DaqNnzbXMilbKHsDcg/ItNrXEl97RfF4myGHPydZ7xvXvmNfnuXaXQMWj5xNTN2cExZFPGCSxrybQzNB3dY4CBl84DlhN0VivZi2W2WurdZjt94c+6cqdoq4JBvdDhd9l7i0+rvIKV6/pi3w/j7rXo7J1tT4/afs5yD2b/AId60utt9Q6v6Q+UU1PP/Eijee4louORuFueayU5LzXynSQRAQEBAQEBAQEBAQEBAQaL0tU2KmY/6riPvW/QFRs63om2r2r+eX3civkFB3/B5RgQUQeZBkiM9kBWts4qTmZP0323+mftaJjuLJL8pWtefxOcOS15e0SzwP6c+SnxeKeC61RLt0q2XQmtJoB1wXwucMTR7TScsTL5eI4rdimd6c/0rwdMmP1na0fv7HS9D6ap6pm0p5WyN44T1mnsc05tPcQCt23l747U6WjS9pF0QikM5aIsJ2heQGYSM8ROQCSjXe+nd85dIOtTa2ve9hIgEYhiLri+BxcJCDuxOLh22IupYpi0WrPj9Y7fx8VuKWwWrf5+6fzfwQjBbxWiXax7mNy7t0N6Q2lBsyc4ZJGfZd84PzkclOvZx/SFOXNvzjf2b2pKIgICAgICAgICAgICAg13X6nx0Uv8tiPH2f6lG3Ze9HX5c8fntcJbuPcVB6dRGBBRAcjEoTSTc1KHO4iOrctRX7SCWK9zs7gd8TyT6St8lC/9ktGO3LxVLeca+TYdG6Mc8kNAyBcblrQALC5LiAMyPNVqdXfvmpiru3u8/oi9b9E1IMUYhcS51mhtnEyEXawhpOE2OKxtkCdwKuY4mu7OdxXF4ssRWtukdZ+n5prZ0BVxCaTZyRvp8BkAxNkax4eRKC3Ix9RwLgexVeW3dD12KdV3ExPby93vYOlBVucxlQKkudYxtm2xLuwsa/fyWevixHq9TNNfDTFoqNz5GxsYXSOvgaBvIIBAv9LPct1KTaJny/mIaMmSmO9Yt4/t02NeDxRbdL6D9IYamogJykja8e9E6x9H+inVzfSVN1rby6OzqbkCAgICAgICAgICAgICDB05Fip5m/yOI8QLj1CxPZu4e3LlrPth88yMwue3sJHlktb18StWRgQEFCgjNKMWYUuJjom+japw1DWncXYT4SNcD+JsfokxuJhzs08sUv5T9XRqyZtMyVzhkWPZbvPs+PWDVSxT106029Zq2+0xP57+zTZNcWxTSv2Jc98dMJBi3yxNETxi3tBhMjbi5DpCc7K5kvy/p8lK/DTknvrrM+6J6xHwljQ6wUjIWUkfyjYnaEyStjc+JxkhljDY2us+Nro3YhcE7V5Fty0xMRGkrYMlrTedb9m+vSYn49f2SVJrRTh75nz1GKeV0gY4OJonSRzRyvjlBOIWls3CAbNbcXaFKLxv86NVuFycuoiNRH/11jXT4dWDofWpuGN8lSQIKcNNI9r3YqmF2OGohcAWgufZz3Eh18QOIELfj3NZ9yllxTGaIjxn6xO4Z9dUUszZImVNMymjimZHG8BkgnaXmGaJ2C7sfUxdb6TwRkCoys0i9NWmJ5tx8vGJa/qHpDYV9JJw2jWO92X5s38MV+SzCxxVebFaPj8n0opvPiAgICAgICAgICAgICCjm3BB3HJCHztpmDBUyNPAm/jvK1PZYrc1YnzYJRJRAQUQYWkGZFZhWzxuFjV2p2c4d2db/bLZPXBbms+Ll5a82K0fH5N36R9PYZcDfasHMHBuIftCPO3mtePHGLdp7z2XOHvHqquesN+8nmStUx4t9dR0ZkVPbN3l/da5v5LVMU97KTlZqZZjTBDMLrneeqGjfckbzw9VdxWmf018eji8RWKT6y3h1/Zkhw4f/e9LRET0b6c0xuz1jPA2PA9h4FYht6PqPQVeJ6eCcfvY4383NBI87qbzd68tprPgzkREBAQEBAQEBAQEBAQEHCukGnwV0ve4n7xLvgQtc93quBvzYKz+eX2a45YW5UCMCC/HRyOAc2KRwO4tY4g2JBsQO0EckRm9Y6TMfNiaQp3Nyexzbi4Dmltx25rLXeYtHSdoSkfhlYeGIA+BNj6ErMudEfq1Pj0bLrNo/afJ5nE9aJrXW4vj6js/EFaM+Tknsz6MwzkpMTPaUbHC1gyFvjzPFVJva3d3KY6Y4/TCzNNwUq1Qvk8IWC5boV7MQ+2O7PyCt4J118nL4uObp7vqyY2DK5v7ufqcvK603yxVdw4MmSN1joz6emxbox4ve4/kwrTOe35+St14GfGXdOiuovQtiNrwvezK9sJ649ok/SI38FYw3m9dy896V4f1HEa84ifz5NxW5zRAQEBAQEBAQEBAQEBByDpdp8NQ1/1mtJ/L/QoW7vQ+i77xa8p/Pq0hyi6svCIqoL84BjiNtxkj5AiQHzkPkso13Fpj3T9vstTtvAP5ZD/3Gi3/AIj5ohf+73x9P9taqhZyy52TpZuk7tpRNd/DlPlK1sn5nu8lW4mN1iWz0dbkz5KfFrlRNwCr0q6l7+EMcBbWqIei3JZiWZjUMMMubduSt16Vc29ee8RH54fWUpFGFQtPNO3oqVitYrHaGZE9R0lvydH6Ia+080JPtsDx4xm3wf6Kzw09ZhwPT2PdKZPKdfPrH0l1VW3mhAQEBAQEBAQEBAQEBBznphprxwv94HkRb8xULOz6Jt1tVy6+QUXcUQEGz6kVlMwzMqtnhds3M2rA8AjEH2ux1iQW9nsqUac/j8ea0VnDvfXep0kdbaigdRPbB8mEwfE4bFuFz7OLSDaNoya9x5LM6VuFpxUZf6u9anvO3Ka9uaxDbnjq2fQcmOjnZe/zLXW7HQvcD5iRnkteSvNSYV6X5OJrbzjTW2i58f8ALKt2dmIZDGKG2yIeajILZTrKGWdVY1My7h3C/nkP1VnJOqaVuFxzbNE+XVJxxqo7UVZDWppLSd1LrtjXUz72G0DHeEl2Z93WB5LZi6WhR9J4vWcLePKN/Lr9Nu/K68OICAgICAgICAgICAgINQ6UKfFRE/VeD5hw+OFRt2dD0bflzfBxaP2VB6WOwgICDy4IxKI0g1ShQzx0S+o0nzpjO52JnKRjv6mRrGu8KGfpWl/K31YPyfC5zewkeRXPtLvU6xtdDVGG1h1JubK3hqqZp3Ol+giyLu05eAyCxmtudLnBY+Ws282cAtcQuvSlpjatzvBsRmD2HgVmIYmItGp7S+i9D1omghmH7yNj+bgCR5q7D57kpOO80nvE6+TMRAQEBAQEBAQEBAQEBBhaa0eKiCSE26wyvuxAhzSe64CxLZiyervFvJxmp1Kq43uBpiI79XZF0p5Wvcdl7HtKhMO5h42PC0a8p7vDdUp+MNTfupyRyOJNN/8AzsfnHzhUaoT/AMKp/wCn3fjTR/z8fnHzVfqfOATsqk9wp8z4XemmJ4/HHjCxHqrUONvk1W3vdAyw8prpyo//AKOOen59XmfUCod+7n/2B/7FnTVk4rHb/tH58WG/VaahLahzZQ0OBJfGGAYCJd4eb32ZCeKrltW+K1azvx+S1rBS4KmUcC7EPA5rm5Y1eYdvg78+GtvYi5nWCUjct97ahhRsJ8TkP1Pkr0fprtWx0m9velGNsABwVZ2IiKxqHtTiEZkUohHmFLTHM7N0VV20oQwnOF72cj12+jrclvr2eQ9LY+TibT56n+f323JSc0QEBAQEBAQEBAQEBAQEBAQEBAQQOvFIJaOZpG4A8r2d+ElYnss8JP8AViJ8dx83FtOXLKaU73Qta732dV3qCqHE1/Xt2/RV/wCjyz4S1uZxc7CFPDTxWrTN7csJKi0ZI5hmay7AHgG7QSGC73NaTicALEkA2G+ynknfbsuYZx0nlmev89vZG/DfdJnQM4bcs620bHhxRmxLJJDjcHWjLRGSQ+1gb9qjFJZni8e9b6a34+cR06dd76a2tR6ImJLQwX6n7yINdtL4Ax5dhkLsLrBpN8J7CpxVi3EY4je/Pwnw77jW417dLf8Aw+XZbbARH9YkD6WA9W9/ay3KfKx66nPyb6/ksZZ0lzOg9D1dhnnhJ/aRtePGN1jzIePuqdXD9NU3FL++PvH3dXUnAEBAQEBAQEBAQEBAQEBAQEBAQEGPpCm2kUkZ+mx7PvAj9USpbltE+T5/0wy1KWgEbGoe23YJQ2X4vPkq+SnNqXY4a3JmyUjx6/PqgIYbZcT7XcD9HxPw8UtPLGndwYdd/j/DYdH6QjETo5No12B8cckbWvLWSOa57Sxzm55OFw7dI4W3Faqz5p5cVpvFq61uJmJ3HWI1HWIn2dNeELzNMRt2zhG8vnPzzXOAjs7HtCxwu67sRtcdTEfaWyNNVsF55YmY1Xt5+Gt+HTXXz9iUdUspooGvhlAbJM5u0LBLiDbsmjA6pY0yOtwcc75ELZEKc1tmvaYtHWI7b17Ynx3Oo90dGrySWuyNz9nwa47xkRiAyvcDyClC7362iNralo2m9Sq7Y11M+9gXiN3hICzPm4Hks6UvSFOfh7ezr8v8bd9R5YQEBAQEBAQEBAQEBAQEBAQEBAQEHENbIxFNpGI2zAkbcbixziTbj1JYz9kqPg6mLLGPLjyz2mNT8Om2mw2sCDcHO++9+N+KqTuZ6vV0mOX9PZeCzEMzKhcO1bIhqtaHjasH0mjmAtkQ02y18Zj5qOrIxvkYPFzf7qcQ1Wz4472j5w8HSUP8Vn32/wB1JrnisP8A7j5wtzaahYC4SgkZtwm5uN1rd6y1ZeMwck7tEvp7RlVtYYpf4kcb/vtDv1UXmGSgICAgICAgICAgICAgICAgICAgINE6RNTpasB9OI8Z9rHcOuBhDmO93Ig2yAUZhcw56+r9Vfs5zB0RVAy2EvHFhlia0+6DJfzTqnHqK9rz8P8ATKb0NvO+F/2qhn6BydUJ/wCPPe1p/PcyI+hl3CKP7VRf4QlZ6sb4WPC37MhnQ4/jHS85JHfCIJ1Y5+H/APE/Nls6HBxFMPsTH+sJ1PWYP/H7z/LJi6IQLfPQj3YJfiZ01J6/FHbHHzlLaN6LaVpDpztrfQw4Izu9ptyXbt2K3aCmkL5omNRWI+DfGtAAAFgMhbgstCqAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICD/9k=", // Motorola
    colors: ["Negro", "Azul"],
    storages: ["128GB"],
    description:
      "Moto Edge ofrece gran autonomía y experiencia Android limpia.",
    specifications: {
      cpu: "",
      ram: "",
      sistemaOperativo: "",
      resolucionPantalla: "",
      bateria: "",
      camaras: "",
      dimensiones: "",
      peso: "",
    },
  },
];

const ProductDetail: React.FC = () => {
  const { productName } = useParams();
  const navigate = useNavigate();
  const product = mockProducts.find((p) => slugify(p.name) === productName);
  const [color, setColor] = React.useState(product?.colors[0] || "");
  const [storage, setStorage] = React.useState(product?.storages[0] || "");

  if (!product) {
    return (
      <div className="p-8 text-center text-gray-500">
        Producto no encontrado.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header con botón de volver */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2"
          >
            ← Volver a la lista de productos
          </button>
        </div>
      </div>

      {/* Vista de detalles */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Imagen del producto */}
            <div className="lg:w-1/2 p-8 bg-gray-50 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-96 object-contain rounded-lg"
              />
            </div>

            {/* Información del producto */}
            <div className="lg:w-1/2 p-8">
              {/* Descripción */}
              <div className="mb-8">
                <div className="inline-flex justify-normal">
                <p className="text-2xl font-medium text-gray-900 mb-2 mr-2">
                  {product.brand}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </p>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Especificaciones técnicas */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Especificaciones técnicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Marca:</span>
                    <span className="text-gray-900">{product.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Precio:</span>
                    <span className="text-gray-900">{product.price} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Modelo:</span>
                    <span className="text-gray-900">{product.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Sistema Operativo:</span>
                    <span className="text-gray-900">
                      {product.specifications?.sistemaOperativo || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">CPU:</span>
                    <span className="text-gray-900">
                      {product.specifications?.cpu || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">RAM:</span>
                    <span className="text-gray-900">
                      {product.specifications?.ram || "-"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">
                      Resolución de pantalla:
                    </span>
                    <span className="text-gray-900">
                      {product.specifications?.resolucionPantalla || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Batería:</span>
                    <span className="text-gray-900">
                      {product.specifications?.bateria || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Cámaras:</span>
                    <span className="text-gray-900">
                      {product.specifications?.camaras || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Dimensiones:</span>
                    <span className="text-gray-900">
                      {product.specifications?.dimensiones || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Peso:</span>
                    <span className="text-gray-900">
                      {product.specifications?.peso || "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Acciones/Selectores */}
              <div className="space-y-6">
                {/* Selector de Almacenamiento */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Almacenamiento:
                  </label>
                  <div className="flex gap-2">
                    {product.storages.map((s) => (
                      <button
                        key={s}
                        onClick={() => setStorage(s)}
                        className={`px-4 py-2 border rounded-md transition-colors ${
                          storage === s
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selector de Color */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Color:
                  </label>
                  <div className="flex gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`px-4 py-2 border rounded-md transition-colors ${
                          color === c
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Botón de Añadir al carrito */}
                <div className="pt-4 flex justify-center">
                  <button className="w-fit bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    Añadir al carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
