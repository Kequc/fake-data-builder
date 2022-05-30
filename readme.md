# fake-data-builder

Makes it easy to build and manage large generated datasets.

```
npm i -D fake-data-builder
```

# Usage

```javascript
import { build, sequence } from 'fake-data-builder';
import { faker } from '@faker-js/faker';

const buildUser = build<User>({
    id: sequence(),
    name: faker.name.findName,
    job: faker.name.jobTitle
});

const user: User = buildUser({
    name: 'Harry Hands'
});

// user ~= {
//     id: 1,
//     name: 'Harry Hands',
//     job: 'Global Accounts Engineer'
// }
```

This dataset can be as deeply nested as needed and all methods, that are passed as values will be run. This is why for the `name` and `job` parameters from our fake user example are pointed at method found in the [faker](https://www.npmjs.com/package/@faker-js/faker) library.

We are also able to use overrides when using the builder.

# Helpers

There are a small number of helpers available.

### # sequence()

Returns a number that is guaranteed to be unique, accepts a generator as a parameter for more control.

```javascript
const result = sequence(i => `user-${i}`)();

// result ~= `'user-1'`
```

### # oneOf()

Returns one of the provided parameters at random.

```javascript
const result = oneOf('Larry', 'Curly', 'Moe')();

// result ~= `'Curly'`
```

### # arrayOf()

Returns an array of the provided value a given number of times.

```javascript
const result = arrayOf(faker.color.rgb, 4)();

// result ~= `['#1ECBE1', '#961EE1', '#E1341E', '#6AE11E']`
```

# Considerations

A builder can be provided as the value for another builder.

```javascript
const buildAddress = build<Address>({
    id: sequence(),
    city: faker.address.city,
    country: faker.address.country
});

const buildManager = build<Manager>({
    id: sequence(),
    name: faker.name.findName,
    address: buildAddress,
    employees: arrayOf(buildUser, 3)
});

const manager = buildManager();

// manager ~= {
//     id: 2,
//     name: 'Joann Osinski',
//     address: {
//         id: 3,
//         city: 'East Jarretmouth',
//         country: 'Greece'
//     },
//     employees: [
//         {
//             id: 4,
//             name: 'Marcella Huels',
//             job: 'Customer Intranet Developer'
//         }, {
//             id: 5,
//             name: 'Alfonso Beer',
//             job: 'Designer'
//         }, {
//             id: 6,
//             name: 'Kelvin Sporer',
//             job: 'Assistant'
//         }
//     ]
// }
```

Overrides can be nested, and contain any value that would be valid in the builder.

```javascript
const manager = buildManager({
    address: {
        country: 'Malta'
    }
});
```

Overriding an array replaces the array. If you need to change values inside of an array it is recommended to modify the result after it is returned.

```javascript
const manager = buildManager();

manager.employees[0].name = 'Samuel Mittensworth';
manager.employees[2] = buildUser({
    job: 'Executive Assistant'
});
```

# Conclusion

This library is being kept simple so that it might be as versatile as possible and provide the best outcome. Please request any features you would like to see added.
