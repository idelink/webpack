import '@/styles/index.less'

class Animal {
  constructor(name) {
    this.name = name
  }

  static sleep() {
    console.log(`${this.name} is sleeping`)
  }

  eat() {
    console.log(`${this.name} is eating`)
  }
}

class Cat extends Animal {
  constructor(name) {
    super(name)
  }
}

const cat = new Cat('hellokitty')

console.log(cat)

document.querySelector('.home').innerHTML = cat.name