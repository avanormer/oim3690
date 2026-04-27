// function getGrade(score) {
//     if (score >= 60) {
//         // return 'Pass'  // return will immediately stop the 
//         console.log('Pass')
//     } 

//     if (score >=90){
//         // return 'A'
//         console.log('A')
//     } else {
//         return 'Some other grade'
//     }
// }

// let result = getGrade(95);
// console.log(`You get ${result}!`)


// function square(x){
//     return x ** 2;
// }

// const square = x => x ** 2;

// let result = square(5);
// console.log(result)

// const add = (a, b) => a + b;

// let sum = add(3, 4);
// console.log(sum)  
// console.log(typeof getGrade)
// console.log(typeof add)  

const fruits = ["Apple", "Banana", "Orange"];
const person = {
    name: "Alice",
    age: 30
};


console.log(typeof fruits)
console.log(Array.isArray(fruits))
console.log(typeof person)
console.log(Array.isArray(person))
// console.log
console.log(fruits[0])

fruits[1] = "Mango"
console.log(fruits)

const word = 'Apple'
console.log(word[0])
word[0] = 'M'  // This will not work because strings are immutable
console.log(word)

const newWord = 'E' + word.substring(1, 5)
console.log(newWord)