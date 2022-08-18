// select dom elements
const counterParentEl = document.getElementById("counter-parent");
const addCounterEl = document.getElementById("add-counter");
const resetCounterEl = document.getElementById("reset");
const eraseCounterEl = document.getElementById("erase");

// action identifiers
const INCREMENT = "increment";
const DECREMENT = "decrement";
const ADDCOUNTER = "addCounter";
const RESETCOUNTER = "resetCounter";
const ERASECOUNTER = "eraseCounter";
const REMOVEONECOUNTER = "removeOneCounter";

// action creators
const increment = (id, value) => ({
    type: INCREMENT,
    payLoad: {
        id,
        incrementValue: value,
    },
});

const decrement = (id, value) => ({
    type: DECREMENT,
    payLoad: {
        id,
        decrementValue: value,
    },
});

const addCounter = () => ({ type: ADDCOUNTER });
const resetCounter = () => ({ type: RESETCOUNTER });
const eraseCounter = () => ({ type: ERASECOUNTER });
const removeOneCounter = (id) => ({
    type: REMOVEONECOUNTER,
    payLoad: {
        id,
    },
});

// initial state
const initialState = [{ id: 1, value: 0 }];

// create reducer function
function counterReducer(state = initialState, action) {
    switch (action.type) {
        case INCREMENT:
            return state.map((individualSate) =>
                individualSate.id === action.payLoad.id
                    ? {
                          ...individualSate,
                          value:
                              individualSate.value +
                              action.payLoad.incrementValue,
                      }
                    : { ...individualSate }
            );
        case DECREMENT:
            return state.map((individualSate) =>
                individualSate.id === action.payLoad.id
                    ? {
                          ...individualSate,
                          value:
                              individualSate.value -
                              action.payLoad.decrementValue,
                      }
                    : { ...individualSate }
            );
        case ADDCOUNTER:
            const temp = state.map((individualSate) => ({ ...individualSate }));
            const maxId = Math.max(
                ...temp.map((individualSate) => individualSate.id)
            );
            return [...temp, { id: maxId + 1, value: 0 }];
        case RESETCOUNTER:
            return state.map((individualSate) => ({
                ...individualSate,
                value: 0,
            }));
        case ERASECOUNTER:
            return [{ id: 1, value: 0 }];
        case REMOVEONECOUNTER:
            const remainingCounters = state.filter(
                (individualSate) => individualSate.id !== action.payLoad.id
            );
            return remainingCounters.length === 0
                ? [{ id: 1, value: 0 }]
                : remainingCounters;
        default:
            return state;
    }
}

// create store
const store = Redux.createStore(counterReducer);

const render = () => {
    const allStates = store.getState();
    const counters = allStates.map(
        (state) => `<div
        class="my-2 p-4 h-auto flex flex-col items-center justify-center space-y-5 bg-white rounded shadow"
    >
        <div id="counter" class="text-2xl font-semibold">
            ${state.value.toString()}
        </div>
        <div class="flex space-x-3">
            <button
                onclick="onCounterIncrement(${state.id},${state.id})"
                id="increment"
                class="bg-indigo-400 text-white px-3 py-2 rounded shadow"
            >
                Increment+${state.id}
            </button>
            <button
                onclick="onCounterDecrement(${state.id},${state.id})"
                id="decrement"
                class="bg-red-400 text-white px-3 py-2 rounded shadow"
            >
                Decrement-${state.id}
            </button>
            <button
                onclick="onRemoveOneCounter(${state.id})"
                class="bg-red-600 text-white px-2 py-0 rounded-full shadow"
            >
                X
            </button>
        </div>
    </div>`
    );
    counterParentEl.innerHTML = counters.join(" ");
};

// update UI initially
render();

store.subscribe(render);

// button click listeners
const onCounterIncrement = (id = 1, value = 1) =>
    store.dispatch(increment(id, value));
const onCounterDecrement = (id = 1, value = 1) =>
    store.dispatch(decrement(id, value));
const onRemoveOneCounter = (id = 1) => store.dispatch(removeOneCounter(id));
addCounterEl.addEventListener("click", () => store.dispatch(addCounter()));
resetCounterEl.addEventListener("click", () => store.dispatch(resetCounter()));
eraseCounterEl.addEventListener("click", () =>
    confirm("You are going to erase everything\nProceed?") === true
        ? store.dispatch(eraseCounter())
        : ""
);
