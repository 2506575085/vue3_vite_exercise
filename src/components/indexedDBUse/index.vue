<script setup lang="ts">
import { onMounted } from 'vue';
const dbName = "MyTestDatabase"
const request = indexedDB.open(dbName, 3)
let db: IDBDatabase
onMounted(() => {
  createObserver(request)
})
const customerData = [
  { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
  { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" },
]
request.onupgradeneeded = (e) => {
  const db = request.result
  const objectStore = db.createObjectStore("customers", { keyPath: "ssn" })
  objectStore.createIndex("name", "name", { unique: false })
  objectStore.createIndex("email", "email", { unique: true })
  objectStore.transaction.oncomplete = (event) => {
    const customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers")
    
    customerData.forEach((customer) => {
      customerObjectStore.add(customer)
    })
  }

  const objStore = db.createObjectStore("name", { autoIncrement: true })
  customerData.forEach(({ name }) => {
    objStore.add(name)
  })
}

console.log(request)
function createObserver(request: IDBOpenDBRequest) {
  request.onsuccess = (e: Event) => {
    db = request.result
    console.log('success', e)
  }
  request.onerror = (e) => {
    console.log('error', e)
  }
}
</script>

<template>

</template>

<style scoped>

</style>