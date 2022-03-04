<template>
<div class="calendar">
    <Calendar is-expanded trim-weeks :rows="2"
        :attributes="attributes"
        >
        </Calendar>
    <div v-for="(aluguel) in alugueis" :key="aluguel.id">
        Data Vencimento: {{ new Date(aluguel.dataDevolucao.seconds*1000).toLocaleDateString('pt-BR') }}
    </div>
</div>
</template>
<script>
import firebase from "../firebase/index";
import 'firebase/storage';
const db = firebase.firestore();
import Calendar from 'v-calendar/lib/components/calendar.umd'

export default {
    components: {
    Calendar
  },
  name: "aluguel",
  firestore: {
    alugueis: db.collection('aluguel'),
  },
  data() {
    const todos = [
      {
        description: 'Take Noah to basketball practice.',
        isComplete: false,
        dates: { weekdays: 6 }, // Every Friday
        color: 'red',
      },
    ];
    return {
        selectedDate: null,
        alugueis: [],
        todos
    };
  },
  computed: {
    attributes() {
        var teste = 
                    [
                        ...this.todos.map(todo => ({
                        dates: todo.dates,
                        dot: {
                            color: todo.color,
                            class: todo.isComplete ? 'opacity-75' : '',
                        },
                        popover: {
                            label: todo.description,
                        },
                        customData: todo,
                        })),
                    ];
        console.log(teste);
      return teste;
    },
  },
};
</script>
<style scoped>
.calendar{
    margin-top: 50px;
}
</style>