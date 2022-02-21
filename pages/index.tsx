import Head from "next/head";
import styles from "../styles/Home.module.css";
import { SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { Todo } from "../lib/todoStore";
import Image from "next/image";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [todo, setTodo] = useState("");

  useEffect(() => {
    setLoading(true);
    loadTodos();
  }, []);

  let changeHandler = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setTodo(event.target.value);
  };

  let addTodo = async (event: { preventDefault: () => void }) => {
    if (todo.length === 0) {
      return;
    }
    setLoading(true);
    setTodo("");
    event.preventDefault();
    const { data } = await axios.post("/api/add", { title: todo });
    setLoading(false);
    setTodos([...todos, data]);
  };

  let removeTodo = async (rtodo: Todo) => {
    setLoading(true);
    await axios.delete(`/api/remove?id=${rtodo.id}`);
    setLoading(false);
    const filteredData = todos.filter((d) => d.id !== rtodo.id);
    setTodos(filteredData);
  };

  let loadTodos = async () => {
    const { data } = await axios.get("/api/list");
    setTodos(data);
    setLoading(false);
  };

  if (!todos) {
    return <div data-testid="loading">Loading...</div>;
  }

  return (
    <div className={styles.container} data-testid="application">
      <Head>
        <title>A5 - TODO</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👨‍🏫</text></svg>"
        />
      </Head>

      <main className={styles.main}>
        <div className={styles.grid}>
          <h1 className={styles.title}>
            TODO 📃 App with{" "}
            <a href="https://blog.upstash.com/nextjs-todo">Next.js!</a>
            <br />
            <br />
          </h1>
          {loading ? (
            <a href="#" className={styles.card}>
              <Image width={20} height={20} alt="loading" src="/loader.gif" />
            </a>
          ) : (
            <form className={styles.cardForm} onSubmit={addTodo}>
              <input
                data-testid="todo-input"
                className={styles.cardInput}
                type="text"
                name="todo"
                onChange={changeHandler}
                placeholder="What are you going to TODO?"
              />
            </form>
          )}
          {todos.map((item) => (
            <a
              data-testid="todo-item"
              key={item.id}
              href="#"
              onClick={() => removeTodo(item)}
              className={styles.card}
            >
              <p>{item.title}</p>
            </a>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://blog.upstash.com/nextjs-todo"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by 👩‍🏫
        </a>
      </footer>
    </div>
  );
}
